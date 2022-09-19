import { Result } from '@badrap/result';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceResponse } from '../../dtos/service.dto';
import { FindServiceQuery } from './find-service.query';
import { FindServiceQueryParams } from './find-service.query-params.dto';

@Controller({
  version: '1',
  path: '/services',
})
export class FindServiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  async show(@Query() params: FindServiceQueryParams) {
    const query = new FindServiceQuery({
      params,
    });

    const result: Result<DataWithPaginationMeta<ServiceEntity[]>> =
      await this.queryBus.execute(query);

    return result.unwrap((r) => {
      const { count, data, limit, page } = r;
      return new DataListResponseBase(
        data.map((d) => new ServiceResponse(d)),
        { count, limit, page },
      );
    });
  }
}
