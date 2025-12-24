import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;

    this.logger.log(`Incoming request: ${method} ${url}`);
    this.logger.log(`Query: ${JSON.stringify(query)}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);

    const logger = this.logger;

    const originalSend = res.send.bind(res);

    res.send = (data: any) => {
      logger.log(`Response status: ${res.statusCode}`);
      return originalSend(data);
    };

    next();
  }
}
