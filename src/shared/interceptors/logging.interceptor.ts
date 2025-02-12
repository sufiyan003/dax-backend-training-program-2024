import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(`Incoming Request: ${request.method} ${request.url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () => console.log(`Response Success: ${request.method} ${request.url} - ${Date.now() - now}ms`),
        error: (err) => console.error(`Response Error: ${request.method} ${request.url} - ${err.message}`),
      }),
    );
  }
}
