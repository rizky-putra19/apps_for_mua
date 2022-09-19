import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { User } from '@src/infrastructure/decorators';
import { Result } from '@badrap/result';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';
import { AddressResponse } from '../../dtos/address.response.dto';
import { AddAddressCommand } from '@src/modules/user/commands/add-address/add-address.command';
import { CreateAddressRequest } from '@src/modules/user/commands/add-address/add-address.request';

@Controller({
  version: '1',
  path: '/profile',
})
@UseGuards(AuthGuard('custom'))
export class AddAddressHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('address')
  async updateUserAddress(
    @User() user: UserEntity,
    @Body() request: CreateAddressRequest,
  ) {
    const command = new AddAddressCommand({
      user,
      address: request,
    });
    const result: Result<UserAddressEntity> = await this.commandBus.execute(
      command,
    );

    return new DataResponseBase(result.unwrap((a) => new AddressResponse(a)));
  }
}
