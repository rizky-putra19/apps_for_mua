import { Result } from '@badrap/result';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import { FinanceType } from '../../domain/enums/finance-type.enum';
import {
  FinanceDetailDisburseResponse,
  FinanceDetailRefundResponse,
} from '../../dtos/finance.dto';
import { GetFinanceQuery } from './get-finance.query';

@Controller({
  version: '1',
  path: '/finance',
})
export class GetFinanceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  async showDetail(@Param('id') id: string) {
    const query = new GetFinanceQuery({
      id,
    });

    const result: Result<FinanceEntity, Error> = await this.queryBus.execute(
      query,
    );

    return new DataResponseBase(
      result.unwrap((f) =>
        f.getPropsCopy().financeType == FinanceType.DISBURSE
          ? new FinanceDetailDisburseResponse(f)
          : new FinanceDetailRefundResponse(f),
      ),
    );
  }
}
