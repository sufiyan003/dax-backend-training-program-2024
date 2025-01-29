import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    // const ctx = context.switchToHttp();
    // const customMessage =
    //   this.reflector.get<string>('responseMessage', context.getHandler()) ||
    //   'SUCCESS';

    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  private responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    // map((data) => ({
    //     status: 'OK',
    //     statusCode: context.switchToHttp().getResponse().statusCode,
    //     message: customMessage,
    //     data,
    //     timestamp: new Date().toISOString(),
    //     path: ctx.getRequest().url,
    // })),
    return {
      status: true,
      path: request.url,
      statusCode,
      timestamp: new Date().toISOString(),
      result: res,
    };
  }
  private errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
      result: exception,
    });
  }
}
