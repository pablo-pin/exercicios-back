import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { DocumentType } from 'generated/prisma';
import { PaginationDto } from 'src/core/types/dto/pagination.dto';

export class AdminListDocumentsDto extends PaginationDto {
  @ApiProperty({ example: DocumentType.RG, enum: DocumentType, required: false })
  @IsEnum(DocumentType)
  @IsOptional()
  type?: DocumentType;

  @ApiProperty({
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsIn(['true', 'false'])
  validated?: 'true' | 'false';
}
