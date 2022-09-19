import { Result } from '@badrap/result';
import { Controller, Query, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { ReasonType } from '../../domain/enums/reason-type.enum';
import { GetReasonsQuery } from './get-reasons.query';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { ReasonResponse } from '../../dtos/reason.dto';

@Controller({
  version: '1',
  path: '/reasons',
})
export class GetReasonsHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async show(@Query('type') type: ReasonType) {
    const query = new GetReasonsQuery({ type });
    const result: Result<ReasonEntity[]> = await this.queryBus.execute(query);

    return new DataResponseBase(result.unwrap());
  }
}
