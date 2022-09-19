import { Result } from '@badrap/result';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { WalletResponse } from '../../dtos/wallet.dto';
import { CreateWalletCommand } from './create-wallet.command';

@Controller({
  version: '1',
  path: '/wallet',
})
@UseGuards(AuthGuard('custom'))
export class CreateWalletHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@User() user: UserEntity) {
    const result: Result<WalletEntity, Error> = await this.commandBus.execute(
      new CreateWalletCommand({
        user,
      }),
    );

    return new DataResponseBase(result.unwrap((w) => new WalletResponse(w)));
  }
}
