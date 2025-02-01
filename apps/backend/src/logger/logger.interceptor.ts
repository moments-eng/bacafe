import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    if (url === '/health') {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() =>
        this.logger.debug('Incoming request', {
          method,
          url,
          duration: `${Date.now() - now}ms`,
        })
      )
    );
  }
}
