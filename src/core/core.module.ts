import { Global, Module } from "@nestjs/common";
import { CommonModule } from "./modules/common/common.module";

import { PrismaModule } from "src/integrations/persistence/database/prisma/prisma.module";

@Global()
@Module({
  imports: [CommonModule, PrismaModule],
})
export class CoreModule {}
