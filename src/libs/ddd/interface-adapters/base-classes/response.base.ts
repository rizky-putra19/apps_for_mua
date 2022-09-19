import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IdResponse } from '../dtos/id.response.dto';

export class ResponseBase extends IdResponse {
  constructor(entity: BaseEntityProps) {
    super(entity.id.value);
    this.createdAt = entity.createdAt.value.toISOString();
    this.updatedAt = entity.updatedAt.value.toISOString();
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @Expose({ name: 'created_at' })
  createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  @Expose({ name: 'updated_at' })
  updatedAt: string;
}
