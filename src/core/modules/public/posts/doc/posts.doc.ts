import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from 'src/core/types/dto/pagination.dto';

class PostWithAuthorResponse {
  @ApiProperty({ example: 'cuid2-1234567890' })
  id: string;

  @ApiProperty({ example: 'My first post' })
  title: string;

  @ApiProperty({ example: 'This is my first post' })
  content: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'john.doe' })
  author: string;
}

export class ListPostsByUsernameResponseDto extends PaginatedResponseDto<PostWithAuthorResponse> {
  @ApiProperty({ type: [PostWithAuthorResponse] })
  data: PostWithAuthorResponse[];

  @ApiProperty({ example: { search: 'My first post' } })
  query?: {
    search: string;
  };
}
