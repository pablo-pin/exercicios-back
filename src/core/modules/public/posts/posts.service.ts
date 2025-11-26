import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { ListPostsDto } from './dto/list-posts.dto';
import { PaginatedResponseDto } from 'src/core/types/dto/pagination.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPostsByUsername({ username, filters }: { username: string; filters: ListPostsDto }) {
    const { page, limit, search } = filters;

    const where: Prisma.PostWhereInput = {
      author: {
        username: { contains: username, mode: 'insensitive' },
      },
      title: { contains: search, mode: 'insensitive' },
    };

    const [posts, totalPosts] = await Promise.all([
      this.prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              username: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({
        where,
      }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      author: post.author.username,
    }));

    return new PaginatedResponseDto({
      data: formattedPosts,
      total: totalPosts,
      page,
      limit,
      query: {
        search,
      },
    });
  }
}
