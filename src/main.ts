import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as YAML from 'yamljs';
import { join } from 'path';

import { AppModule } from './app.module';
import { PORT } from './config/config';
import { LoggingService } from './logger/logging.service';
import { AllExceptionsFilter } from './logger/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggingService);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  const openApiPath = join(process.cwd(), 'doc', 'openapi.yaml');
  const document = YAML.load(openApiPath);
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught exception: ${error.message}`);
    if (error.stack) {
      logger.debug(error.stack);
    }
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled promise rejection');
    logger.debug(
      typeof reason === 'object' ? JSON.stringify(reason) : String(reason),
    );
  });

  await app.listen(PORT);
  logger.log(`Server listening on http://localhost:${PORT}`);
}

bootstrap();
