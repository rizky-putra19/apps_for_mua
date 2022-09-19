import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T extends DataResponse> {
  result: T;
}

export interface DataResponse {
  data: any | any[];
  metadata?: any;
}

export interface DataResponseOut {
  data: any | any[];
  metadata?: any;
}

@Injectable()
export class TransformInterceptor<T extends DataResponse>
  implements NestInterceptor<T, DataResponseOut>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<DataResponseOut> | Promise<Observable<DataResponseOut>> {
    const req = context.switchToHttp().getRequest();
    if (req.path.includes('v1')) {
      return next.handle().pipe(
        map((data) => {
          return { data: data.data, metadata: data.metadata };
        }),
      );
    }
    return next.handle().pipe();
  }
}
