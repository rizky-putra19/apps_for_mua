import { Result } from '@badrap/result';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { ReasonOrmEntiy } from '../../database/reason.orm-entity';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { ReasonResponse } from '../../dtos/reason.dto';
import { GetReasonQuery } from './get-reason.query';

@Controller({
  version: '1',
  path: '/reasons',
})
export class GetReasonHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  async show(
    @Param('id') id: number,
  ): Promise<DataResponseBase<ReasonResponse, any>> {
    const query = new GetReasonQuery({ id });
    const result: Result<ReasonEntity> = await this.queryBus.execute(query);

    return new DataResponseBase(result.unwrap((r) => new ReasonResponse(r)));
  }
}
