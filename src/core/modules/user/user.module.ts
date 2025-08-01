import { Module } from '@nestjs/common';
import { DocumentModule } from './document/document.module';

@Module({
  controllers: [],
  providers: [],
  imports: [DocumentModule],
})
export class UserModule {}
