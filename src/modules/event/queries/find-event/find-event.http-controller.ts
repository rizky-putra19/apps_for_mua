import { Result } from '@badrap/result';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../dtos/event.response.dto';
import { FindEventQuery } from './find-event.query';
import { FindEventQueryParams } from './find-event.query-params.dto';

@Controller({
  version: '1',
  path: '/events',
})
export class FindEventHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  async index(@Query() params: FindEventQueryParams) {
    const res: Result<DataWithPaginationMeta<EventEntity[]>> =
      await this.queryBus.execute(
        new FindEventQuery({ findEventQueryParams: params, isAdmin: false }),
      );

    return res.unwrap((r) => {
      const { count, data, limit, page } = r;
      return new DataListResponseBase(
        data.map((d) => new EventResponseDto(d)),
        { count, limit, page },
      );
    });
  }
}
