import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './integrations/persistence/database/prisma/prisma.module';
import { FileModule } from './integrations/persistence/storage/file/file.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CoreModule, FileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
