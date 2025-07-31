import { Module } from "@nestjs/common";
import { CoreModule } from "./core/core.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./integrations/persistence/database/prisma/prisma.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
