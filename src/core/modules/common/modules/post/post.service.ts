import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { EditPostDto } from './dto/edit-post.dto';
import { AppErrorNotFound } from 'src/utils/errors/app-errors';
import { Post } from 'generated/prisma';
import { EditPostResponseDto } from './doc/post.doc';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  private async findPost({ userId, postId }: { userId: string; postId: string }): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
        deleted: false,
        author: {
          userId,
        },
      },
    });

    if (!post) {
      throw new AppErrorNotFound('Post not found');
    }

    return post;
  }

  async edit({
    userId,
    postId,
    body,
  }: {
    userId: string;
    postId: string;
    body: EditPostDto;
  }): Promise<EditPostResponseDto> {
    await this.findPost({ userId, postId });

    return await this.prismaService.post.update({
      where: { id: postId },
      data: body,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete({ userId, postId }: { userId: string; postId: string }): Promise<void> {
    await this.findPost({ userId, postId });

    await this.prismaService.post.update({
      where: { id: postId },
      data: { deleted: true },
    });
  }
}
