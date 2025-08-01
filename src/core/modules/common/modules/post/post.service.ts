import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { EditPostDto } from './dto/edit-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async edit(params: { postId: string; body: EditPostDto }): Promise<any> {
    const { postId, body } = params;

    return await this.prismaService.post.update({
      where: { id: postId },
      data: body,
    });
  }

  async delete(params: { postId: string }): Promise<void> {
    const { postId } = params;

    await this.prismaService.post.deleteMany();
  }
}
