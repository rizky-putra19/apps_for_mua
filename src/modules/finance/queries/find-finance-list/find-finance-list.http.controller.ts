import { Result } from '@badrap/result';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  DataAndCountMeta,
  DataWithPaginationMeta,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import {
  FinanceListDisburseResponse,
  FinanceListRefundResponse,
} from '../../dtos/finance.dto';
import { FindFinanceListQuery } from './find-finance-list.query';
import { FindFinanceListQueryParams } from './find-finance-list.query-params.dto';

@Controller({
  version: '1',
  path: '/finance',
})
export class FindFinanceListHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/list/:financeType')
  async show(
    @Param('financeType') financeType: string,
    @Query() params: FindFinanceListQueryParams,
  ) {
    const result: Result<DataWithPaginationMeta<FinanceEntity[]>> =
      await this.queryBus.execute(
        new FindFinanceListQuery({
          financeType,
          params,
        }),
      );

    const { data, count, limit, page } = result.unwrap();
    return new DataListResponseBase(
      data.map((f) =>
        financeType == 'disburse'
          ? new FinanceListDisburseResponse(f)
          : new FinanceListRefundResponse(f),
      ),
      { count, limit, page },
    );
  }
}
