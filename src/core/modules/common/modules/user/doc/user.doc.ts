import { ApiProperty } from "@nestjs/swagger";

class ProfileResponseDto {
  @ApiProperty({ example: "John Doe" })
  username: string;
}

export class FindUserByIdResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ type: ProfileResponseDto })
  profile: ProfileResponseDto;
}
