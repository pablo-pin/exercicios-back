import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany();
  }
}
