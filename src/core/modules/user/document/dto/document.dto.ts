import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
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
  @IsNumberString()
  @Transform(({ value }) => value.replaceAll(/\D/g, ''))
  @Length(7, 11)
  number: string;
}
