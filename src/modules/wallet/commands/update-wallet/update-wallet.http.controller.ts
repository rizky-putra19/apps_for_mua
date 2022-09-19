import { Result } from '@badrap/result';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { WalletResponse } from '../../dtos/wallet.dto';
import { UpdateWalletCommand } from './update-wallet.command';
import { UpdateWalletRequest } from './update-wallet.request';

@Controller({
  version: '1',
  path: '/wallet',
})
export class UpdateWalletHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:artisanID')
  async edit(
    @Param('artisanID') artisanID: string,
    @Body() request: UpdateWalletRequest,
  ) {
    const command = new UpdateWalletCommand({
      artisanID,
      currentBalance: request.currentBalance,
      onHold: request.onHold,
      ready: request.ready,
    });
    const result: Result<WalletEntity> = await this.commandBus.execute(command);

    return new DataResponseBase(result.unwrap((w) => new WalletResponse(w)));
  }
}
