import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestResponseLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body } = req;

    console.log('REQ: %j', {
      originalUrl,
      method,
      params,
      query,
      body,
    });

    return next.handle().pipe(
      tap((data) =>
        console.log('RES: %j', {
          statusCode,
          data,
        }),
      ),
    );
  }
}
