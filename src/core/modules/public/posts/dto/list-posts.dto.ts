import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/core/types/dto/pagination.dto';

export class ListPostsDto extends PaginationDto {
  @ApiProperty({
    description: 'Search for a post by title',
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string = '';
}
