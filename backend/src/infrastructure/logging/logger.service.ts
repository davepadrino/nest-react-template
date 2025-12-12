import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Logger Service
 *
 * Centralized logging using Winston
 */
@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'backend-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const ctx = context ? `[${context}]` : '';
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `${timestamp} ${level} ${ctx} ${message} ${metaStr}`;
            }),
          ),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: string, meta?: any) {
    this.logger.info(message, { context: this.context, ...meta });
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, trace?: string, meta?: any) {
    this.logger.error(message, { context: this.context, trace, ...meta });
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, meta?: any) {
    this.logger.warn(message, { context: this.context, ...meta });
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, meta?: any) {
    this.logger.debug(message, { context: this.context, ...meta });
  }
  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose(message: string, meta?: any) {
    this.logger.verbose(message, { context: this.context, ...meta });
  }
}
