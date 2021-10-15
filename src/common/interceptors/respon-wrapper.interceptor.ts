import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        code: context.switchToHttp().getResponse().statusCode,
        status: this.isSuccessed(
          context.switchToHttp().getResponse().statusCode,
        ),
        data: data,
      })),
    );
  }

  private isSuccessed(statusCode: any) {
    switch (statusCode) {
      case HttpStatus.ACCEPTED:
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        return 'success';
      default:
        return 'failed';
    }
  }
}
