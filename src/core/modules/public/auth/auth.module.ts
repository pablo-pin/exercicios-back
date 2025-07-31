import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthenticationModule } from '../../common/modules/auth/authentication/authentication.module';

@Module({
  controllers: [AuthController],
  imports: [AuthenticationModule],
})
export class AuthModule {}
