import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '@domain/exceptions/domain.exception';
import { LoggerService } from '@infrastructure/logging/logger.service';

/**
 * Global Exception Filter
 *
 * Handles all exceptions and formats error responses consistently
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggerService(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : // TODO: improve typing
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (exceptionResponse as any).message || message;
      error = exception.name;
    } else if (exception instanceof DomainException) {
      status = this.getDomainExceptionStatus(exception);
      message = exception.message;
      error = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(
      `Error occurred: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    });
  }

  private getDomainExceptionStatus(exception: DomainException): HttpStatus {
    if (exception.name === 'UserNotFoundException') {
      return HttpStatus.NOT_FOUND;
    }
    if (exception.name === 'UserAlreadyExistsException') {
      return HttpStatus.CONFLICT;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
