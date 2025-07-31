import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthenticationModule],
})
export class AuthModule {}
