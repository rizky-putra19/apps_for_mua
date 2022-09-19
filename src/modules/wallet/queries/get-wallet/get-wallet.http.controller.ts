import { Result } from '@badrap/result';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { WalletResponse } from '../../dtos/wallet.dto';
import { GetWalletQuery } from './get-wallet.query';

@Controller({
  version: '1',
  path: '/wallet',
})
export class GetWalletHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:artisanID')
  async show(@Param('artisanID') artisanID: string) {
    const result: Result<WalletEntity> = await this.queryBus.execute(
      new GetWalletQuery({
        artisanID,
      }),
    );

    return new DataResponseBase(result.unwrap((w) => new WalletResponse(w)));
  }
}
