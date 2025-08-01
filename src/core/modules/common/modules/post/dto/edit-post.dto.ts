import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditPostDto {
  @ApiProperty({ example: 'My new post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is my new post' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
