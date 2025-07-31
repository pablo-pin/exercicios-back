import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { ListPostsDto } from './dto/list-posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPostsByUsername(params: { username: string; filters: ListPostsDto }) {
    return await this.prisma.post.findMany();
  }
}
