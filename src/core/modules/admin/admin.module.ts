import { Module } from '@nestjs/common';
import { AdminUserModule } from './modules/admin-user/admin-user.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AdminUserModule],
})
export class AdminModule {}
