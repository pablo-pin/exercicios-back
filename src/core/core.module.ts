import { Global, Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from 'src/integrations/persistence/database/prisma/prisma.module';
import { AuthModule } from './modules/public/auth/auth.module';

@Global()
@Module({
  imports: [CommonModule, PrismaModule, AuthModule],
})
export class CoreModule {}
