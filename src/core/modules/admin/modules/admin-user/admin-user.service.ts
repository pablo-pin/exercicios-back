import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { FileService } from 'src/integrations/persistence/storage/file/file.service';
import { AdminListDocumentsDto } from './dto/list-documents.dto';
import { PaginatedResponseDto } from 'src/core/types/dto/pagination.dto';
import { AppErrorConflict, AppErrorNotFound } from 'src/utils/errors/app-errors';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async list(query: AdminListDocumentsDto) {
    const { type, page, limit, validated } = query;
    let validatedFilter: boolean | undefined;

    if (validated) {
      validatedFilter = validated === 'true';
    }

    const [documents, totalDocuments] = await Promise.all([
      this.prisma.document.findMany({
        where: { type, validated: validatedFilter },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          number: true,
          validated: true,
          createdAt: true,
          file: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      }),
      this.prisma.document.count({ where: { type, validated: validatedFilter } }),
    ]);

    const updatedDocuments = await this.fileService.updateUrlsInObjects(documents);

    return new PaginatedResponseDto({
      data: updatedDocuments,
      total: totalDocuments,
      page,
      limit,
      query: { type, validated },
    });
  }

  async approve(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new AppErrorNotFound('Document not found');
    }

    if (document.validated) {
      throw new AppErrorConflict('Document already validated');
    }

    return await this.prisma.document.update({
      where: { id: documentId },
      data: { validated: true },
      select: {
        id: true,
        type: true,
        number: true,
        validated: true,
        createdAt: true,
        file: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }
}
