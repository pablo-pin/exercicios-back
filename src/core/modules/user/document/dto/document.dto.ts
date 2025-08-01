import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from 'generated/prisma';

export class UploadUserDocumentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({ example: DocumentType.RG, enum: DocumentType })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  type: DocumentType;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  number: string;
}
