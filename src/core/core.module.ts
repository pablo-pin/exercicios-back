import { Global, Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from 'src/integrations/persistence/database/prisma/prisma.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';

@Global()
@Module({
  imports: [CommonModule, PrismaModule, AuthModule, UserModule, AdminModule],
})
export class CoreModule {}
