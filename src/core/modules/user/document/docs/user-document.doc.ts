import { ApiProperty } from '@nestjs/swagger';

class FileResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'https://example.com/file.pdf' })
  url: string;
}

export class UserDocumentResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'RG' })
  type: string;

  @ApiProperty({ example: '1234567890' })
  number: string;

  @ApiProperty({ example: true })
  validated: boolean;

  @ApiProperty({ example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ type: FileResponse })
  file: FileResponse;
}
