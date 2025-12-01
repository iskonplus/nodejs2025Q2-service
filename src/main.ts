import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const openApiPath = join(process.cwd(), 'doc', 'openapi.yaml');
  const document = YAML.load(openApiPath);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
