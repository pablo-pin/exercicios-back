import { Body, Controller, Delete, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { Doc } from 'src/utils/documentation/doc';
import { EditPostDto } from './dto/edit-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/utils/decorators/user-id.decorator';
import { EditPostResponseDto } from './doc/post.doc';

@ApiTags('Private/Posts')
@UseGuards(JwtAuthGuard)
@Controller('private/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Doc({
    name: 'Edit post',
    description: `Edit a user's post`,
    response: EditPostResponseDto,
  })
  @Put('/:postId')
  async edit(@UserId() userId: string, @Param('postId') postId: string, @Body() body: EditPostDto) {
    return await this.postService.edit({ userId, postId, body });
  }

  @Doc({
    name: 'Delete post',
    description: `Delete a user's post`,
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete('/:postId')
  async delete(@UserId() userId: string, @Param('postId') postId: string) {
    await this.postService.delete({ userId, postId });
  }
}
