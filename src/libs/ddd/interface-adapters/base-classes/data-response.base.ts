import { DataResponse } from '@src/infrastructure/interceptors/transformer.interceptor';
import { Expose } from 'class-transformer';

export class DataResponseBase<T, M> implements DataResponse {
  readonly data: T;
  readonly metadata?: M;
  constructor(data: T, metadata?: M) {
    this.data = data;
    this.metadata = metadata;
  }
}
