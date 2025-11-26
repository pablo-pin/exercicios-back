import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { ENUM_OPERATOR_TYPE } from 'src/integrations/persistence/storage/file/file.enum';
import { FileService } from 'src/integrations/persistence/storage/file/file.service';
import {
  AppErrorBadRequest,
  AppErrorConflict,
  AppErrorForbidden,
  AppErrorNotFound,
} from 'src/utils/errors/app-errors';
import { UploadUserDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async save({
    userId,
    body,
    file,
  }: {
    userId: string;
    body: UploadUserDocumentDto;
    file: Express.Multer.File;
  }) {
    if (!file) {
      throw new AppErrorBadRequest('No files found');
    }

    const existingDocument = await this.prisma.document.findFirst({
      where: {
        userId,
        type: body.type,
      },
    });

    if (existingDocument) {
      throw new AppErrorConflict('You can only save one document of each type');
    }

    const savedDocument = await this.prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          number: body.number,
          type: body.type,
          userId,
        },
      });

      const savedFile = await this.fileService.saveFile({
        entity: 'user-document',
        entityId: document.id,
        file,
        operatorId: userId,
        operatorType: ENUM_OPERATOR_TYPE.USER,
      });

      const updatedDocument = await tx.document.update({
        where: {
          id: document.id,
        },
        data: {
          fileId: savedFile.id,
        },
      });

      return {
        id: updatedDocument.id,
        type: updatedDocument.type,
        number: updatedDocument.number,
        validated: updatedDocument.validated,
        createdAt: updatedDocument.createdAt,
        file: {
          id: savedFile.id,
          url: savedFile.url,
        },
      };
    });

    return savedDocument;
  }

  async list(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
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

    return await this.fileService.updateUrlsInObjects(documents);
  }

  async delete({ userId, documentId }: { userId: string; documentId: string }) {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      throw new AppErrorNotFound('Document not found');
    }

    if (document.validated) {
      throw new AppErrorForbidden(
        'This document was already validated by an admin, therefore it cannot be deleted.',
      );
    }

    await this.fileService.deleteFile(document.fileId);
  }
}
