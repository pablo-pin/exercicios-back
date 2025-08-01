import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppErrorInternal } from 'src/utils/errors/app-errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;
  private readonly AWS_REGION: string;
  private readonly AWS_ACCESS_KEY_ID: string;
  private readonly AWS_SECRET_ACCESS_KEY: string;
  private readonly AWS_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.AWS_REGION = this.configService.get<string>('AWS_REGION');
    this.AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    this.AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.AWS_BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');

    if (
      !this.AWS_REGION ||
      !this.AWS_ACCESS_KEY_ID ||
      !this.AWS_SECRET_ACCESS_KEY ||
      !this.AWS_BUCKET_NAME
    ) {
      throw new AppErrorInternal(
        'AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY ou AWS_BUCKET_NAME não estão definidas nas variáveis de ambiente',
      );
    }

    this.s3Client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private generateUniqueName(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private async streamToBuffer(stream: Readable | ReadableStream): Promise<Buffer> {
    if (stream instanceof Readable) {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    } else {
      const reader = stream.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string[]> {
    const name = file.originalname.split('.')[0];
    const extension = file.originalname.split('.').pop();
    const key = `${name}_${this.generateUniqueName()}.${extension}`;

    const putObjectParams: PutObjectCommandInput = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(putObjectParams);
      await this.s3Client.send(command);
      const url = await this.fileUrl(key);

      return [key, url];
    } catch (error) {
      throw new AppErrorInternal('Erro ao fazer o upload para o S3: ' + error.message);
    }
  }

  async fileUrl(key: string): Promise<string> {
    const getObjectParams = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 60 * 60 * 24 * 5 /* 5 dias */,
      });
      return url;
    } catch (error) {
      throw new Error('Erro ao obter URL do arquivo do S3: ' + error.message);
    }
  }

  async deleteFile(key: string): Promise<{ key: string }> {
    const deleteObjectParams: DeleteObjectCommandInput = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(deleteObjectParams);
      await this.s3Client.send(command);
      return { key }; // Retorna a URL para confirmação
    } catch (error) {
      throw new Error('Erro ao excluir arquivo do S3: ' + error.message);
    }
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const getObjectParams = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const { Body } = await this.s3Client.send(command);

      if (Body instanceof Readable) {
        // Node.js Readable stream
        return new Promise((resolve, reject) => {
          const chunks = [];
          Body.on('data', (chunk) => chunks.push(chunk));
          Body.on('error', reject);
          Body.on('end', () => resolve(Buffer.concat(chunks)));
        });
      } else {
        throw new Error(
          'O corpo recebido não é uma instância de Readable. Tipo recebido: ' + typeof Body,
        );
      }
    } catch (error) {
      throw new Error('Erro ao obter arquivo do S3: ' + error.message);
    }
  }

  async getUploadFileUrl(key: string): Promise<string> {
    const putObjectParams = {
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    };

    try {
      const command = new PutObjectCommand(putObjectParams);
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 5 /* 5 segundos */,
      });
      return url;
    } catch (error) {
      throw new Error('Erro ao obter URL do S3: ' + error.message);
    }
  }
}
