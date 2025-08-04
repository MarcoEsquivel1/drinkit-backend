import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseDto, ResponseBuilder } from '../../dtos/response.dto';
import { handleError } from '../../utils/error.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ResponseDto) {
          return data;
        }

        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data
        ) {
          return data as ResponseDto<any>;
        }

        if (data === null || data === undefined) {
          return ResponseBuilder.success(null, 'Operación exitosa');
        }

        return ResponseBuilder.success(data, 'Operación exitosa');
      }),
      catchError((error) => {
        const errorResult = handleError(error, this.logger);
        return throwError(() => errorResult.result);
      }),
    );
  }
}
