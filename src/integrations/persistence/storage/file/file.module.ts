import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { AwsModule } from './aws/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Global()
@Module({
  imports: [
    AwsModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [FileService, MulterConfigService],
  exports: [FileService],
})
export class FileModule {}
