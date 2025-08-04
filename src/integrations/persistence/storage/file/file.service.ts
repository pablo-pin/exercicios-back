import { Injectable } from '@nestjs/common';
import { AwsService } from './aws/aws.service';
import { File } from 'generated/prisma';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AppErrorBadRequest, AppErrorInternal } from 'src/utils/errors/app-errors';
import { ENUM_OPERATOR_TYPE } from './file.enum';

@Injectable()
export class FileService {
  constructor(
    private readonly awsService: AwsService,
    private readonly prisma: PrismaService,
  ) {}

  private async relateFile(params: {
    operatorId: string;
    operatorType: ENUM_OPERATOR_TYPE;
    entity: string;
    entityId: string;
    name: string;
    type: string;
    size: number;
    url: string;
    expiresAt: Date;
  }): Promise<File> {
    try {
      const file = await this.prisma.file.create({
        data: {
          ...params,
        },
      });
      return file;
    } catch {
      throw new AppErrorInternal('Erro ao criar registro de anexo no banco');
    }
  }

  private async uploadFile(file: Express.Multer.File): Promise<string[]> {
    if (!file) {
      throw new AppErrorBadRequest('Nenhum arquivo foi enviado.');
    }
    if (!file.originalname) {
      throw new AppErrorBadRequest('Nome do arquivo inválido.');
    }

    const [key, url] = await this.awsService.uploadFile(file);

    return [key, url];
  }

  async saveFile(params: {
    file: Express.Multer.File;
    operatorId: string;
    operatorType: ENUM_OPERATOR_TYPE;
    entity: string;
    entityId: string;
  }): Promise<File> {
    const { file, operatorId, operatorType, entity, entityId } = params;

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/png',
      'audio/midi',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'audio/wav',
      'audio/mp4',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new AppErrorBadRequest(
        `Tipo de arquivo inválido. São aceitos um dos seguintes tipos: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const extension = file.originalname.split('.').pop();
    const formattedName = file.originalname
      // Remove a extensão do nome do arquivo
      .split('.')
      .slice(0, -1)
      .join('')
      // Substitui espaços e pontos por underline
      .replace(/ /g, '_')
      .replace(/\./g, '_');
    const pathFileName = `${operatorType}/${operatorId}/${entity}/${formattedName}_id${entityId}.${extension}`;
    file.originalname = pathFileName;

    const [key, url] = await this.uploadFile(file);

    // 5 dias no futuro
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);

    // Cria um registro do arquivo no banco de dados
    const savedFile = await this.relateFile({
      operatorId,
      operatorType,
      entity,
      entityId,
      name: key,
      type: file.mimetype,
      size: file.size,
      url: url,
      expiresAt,
    });

    // Retorna a URL do arquivo
    return savedFile;
  }

  async getFile(params: { entity: string; entityId: string }): Promise<File | null> {
    const { entity, entityId } = params;

    let file = await this.prisma.file.findFirst({
      where: {
        entity,
        entityId,
      },
    });

    if (!file) {
      return null;
    }

    const urlExpiration = new Date(file.expiresAt);
    const today = new Date();

    if (today >= urlExpiration) {
      // renovando a URL
      const newExpiration = new Date();
      newExpiration.setDate(newExpiration.getDate() + 5); // 5 dias no futuro
      const url = await this.awsService.fileUrl(file.name);
      file = await this.prisma.file.update({
        where: { id: file.id },
        data: {
          url: url,
          expiresAt: newExpiration,
        },
      });
    }

    return file;
  }

  async getFileById(id: string): Promise<File | null> {
    const file = await this.prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      return null;
    }

    return await this.getFile({
      entity: file.entity,
      entityId: file.entityId,
    });
  }

  async updateFileEntity(params: {
    fileId: string;
    entity: string;
    entityId: string;
  }): Promise<File | null> {
    const { fileId, entity, entityId } = params;

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        entity,
        entityId,
      },
    });

    return updatedFile;
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });
      await this.awsService.deleteFile(file.name);
      await this.prisma.file.delete({
        where: {
          id: fileId,
        },
      });

      return;
    } catch {
      throw new AppErrorInternal('Erro ao deletar arquivo.');
    }
  }

  async updateFileUrl<T extends { id: string; url: string }>(file: T): Promise<T> {
    const updatedFile = await this.getFileById(file.id);
    const url = updatedFile ? updatedFile.url : file.url;

    return { ...file, url };
  }

  async updateUrlsInObjects<T extends { [K in keyof T]: any }>(objects: T[]): Promise<T[]> {
    const formattedObjects = await Promise.all(
      objects.map(async (currentObject) => {
        const result = { ...currentObject };

        for (const key in currentObject) {
          // verifica se a chave do objeto é um arquivo (se tem id e url)
          if (currentObject[key]?.id && currentObject[key]?.url) {
            result[key] = await this.updateFileUrl(currentObject[key]);
          }
        }

        return result;
      }),
    );

    return formattedObjects;
  }
}
