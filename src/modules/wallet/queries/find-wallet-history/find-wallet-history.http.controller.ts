import { Result } from '@badrap/result';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { WalletHistoryEntity } from '../../domain/entities/wallet-history.entity';
import { WalletHistoryResponse } from '../../dtos/wallet.dto';
import { FindWalletHistoryQuery } from './find-wallet-history.query';
import { FindWalletHistoryQueryParams } from './find-wallet-history.query-params.dto';

@Controller({
  version: '1',
  path: '/wallet',
})
export class FindWalletHistoryHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async show(@Query() params: FindWalletHistoryQueryParams) {
    const result: Result<DataAndCountMeta<WalletHistoryEntity[]>> =
      await this.queryBus.execute(
        new FindWalletHistoryQuery({
          params,
        }),
      );

    return result.unwrap((r) => {
      const { count, data } = r;
      return new DataListResponseBase(
        data.map((d) => new WalletHistoryResponse(d)),
        { count },
      );
    });
  }
}
