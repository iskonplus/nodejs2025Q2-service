import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggingService } from 'src/logger/logging.service';
import { RequestLoggerMiddleware } from 'src/logger/request-logger.middleware';

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
