import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
              },
            }
          : undefined,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info({ ...optionalParams }, message);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error({ ...optionalParams }, message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn({ ...optionalParams }, message);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug({ ...optionalParams }, message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace({ ...optionalParams }, message);
  }
}
