import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private static instance: PrismaClient;

  onModuleDestroy() {
    if (PrismaService.instance) {
      console.log("Desconectanto do Banco de Dados");
      PrismaService.instance.$disconnect();
    }
  }

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      console.log("Conectando ao Banco de Dados");
      PrismaService.instance = new PrismaClient({
        log: ["warn", "error"],
        transactionOptions: {
          timeout: 25000,
        },
      });
      PrismaService.instance.$connect();
    }

    return PrismaService.instance;
  }
}
