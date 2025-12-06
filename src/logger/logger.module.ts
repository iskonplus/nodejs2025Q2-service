import { Global, Module } from '@nestjs/common';
import { LoggingService } from 'src/logging/logging.service';

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule {}
