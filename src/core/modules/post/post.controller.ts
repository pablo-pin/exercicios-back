import { Controller, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Private/Posts')
@UseGuards(JwtAuthGuard)
@Controller('private/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
}
