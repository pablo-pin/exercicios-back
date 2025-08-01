import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ example: 'ey.JWT.TOKEN' })
  token: string;
}

export class SignInResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'ey.JWT.TOKEN' })
  token: string;
}
