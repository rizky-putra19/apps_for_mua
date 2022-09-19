import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import { DataResponse } from '@src/infrastructure/interceptors/transformer.interceptor';
import { Expose } from 'class-transformer';
import { IdResponse } from '../dtos/id.response.dto';

export class DataListResponseBase<T, M> implements DataResponse {
  @Expose()
  readonly data: T[];
  @Expose()
  readonly metadata?: M;
  constructor(data: T[], metadata?: M) {
    this.data = data;
    this.metadata = metadata;
  }
}
