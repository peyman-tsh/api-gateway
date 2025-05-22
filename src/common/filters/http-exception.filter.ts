import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseTransformer } from '../transformers/response.transformer';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly responseTransformer: ResponseTransformer) {}

  catch(exception: Error, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = this.responseTransformer.error(
      message,
      request.url
    );

    response.status(status).json(errorResponse);
  }
} 