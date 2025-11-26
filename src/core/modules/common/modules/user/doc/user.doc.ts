import { ApiProperty } from '@nestjs/swagger';

class UserInListResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'john.doe' })
  username: string;

  @ApiProperty({ example: "I'm a software engineer" })
  bio: string | null;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  birthDate: Date | null;

  @ApiProperty({ example: 14 })
  numberOfPosts: number;
}

export class FindAllUsersResponse {
  @ApiProperty({ type: [UserInListResponse] })
  users: UserInListResponse[];
}

class PostResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'My first post' })
  title: string;

  @ApiProperty({ example: 'This is my first post' })
  content: string;

  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  createdAt: Date;
}

class ProfileResponse {
  @ApiProperty({ example: "I'm a software engineer" })
  bio: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  birthDate: Date;

  @ApiProperty({ type: [PostResponse] })
  posts: PostResponse[];
}

export class FindUserByIdResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2020-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: ProfileResponse })
  profile: ProfileResponse;
}
