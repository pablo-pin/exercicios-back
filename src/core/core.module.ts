import { Global, Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from 'src/integrations/persistence/database/prisma/prisma.module';
import { PostsModule } from './modules/public/posts/posts.module';

@Global()
@Module({
  imports: [CommonModule, PrismaModule, PostsModule],
})
export class CoreModule {}
