// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
//
// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//     const error = exception.getResponse() as
//       | string
//       | { error: string; statusCode: number; message: string | string[] };
//
//     if (typeof error === 'string') {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         // path: request.url,
//         message: error,
//         data: null,
//       });
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         message: error.message,
//         timestamp: new Date().toISOString(),
//         data: null,
//       });
//     }
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;

      if (Array.isArray(message)) {
        message = message[0];
      }
    }

    response.status(status).json({
      data: null,
      status,
      message,
    });
  }
}
