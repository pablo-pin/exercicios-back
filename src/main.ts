import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDoc } from './utils/documentation/app-doc';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ValidationFactory } from './utils/errors/errors-validation';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { AppErrorFilter } from './utils/errors/errors.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appDoc = new AppDoc(app);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: ValidationFactory,
    }),
  );

  // Saída
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'exposeAll',
      enableImplicitConversion: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AppErrorFilter());

  app.enableShutdownHooks();

  app.enableCors({
    origin: true, //Definir especificamente quais endpoints podem acessar o backend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, api-key',
    credentials: true,
  });

  // HABILITA PORTA E INICIA A APLICAÇÃO
  const porta = process.env.PORT || 3003;
  await app.listen(porta);

  const hostEnv = process.env.BACKEND_URL ?? 'http://localhost:3003';
  console.log(`\n📑 Total de rotas documentadas: ${appDoc.getTotalRoutes()}`);
  console.log(`📡 Aplicação executando na porta ${porta}`);
  console.log(`📒 Documentação em: ${hostEnv}/docs\n`);
}
bootstrap();
