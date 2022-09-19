import { Result } from '@badrap/result';
import { Controller, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { EditAddressCommand } from '@src/modules/user/commands/edit-address/edit-address.command';
import { EditAddressRequest } from '@src/modules/user/commands/edit-address/edit-address.request';
import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { AddressResponse } from '../../dtos/address.response.dto';

@Controller({
  version: '1',
  path: '/profile',
})
export class EditAddressHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('address/:id')
  @UseGuards(AuthGuard('custom'))
  async edit(
    @User() user: UserEntity,
    @Param('id') id: number,
    @Body() request: EditAddressRequest,
  ) {
    const command = new EditAddressCommand({
      id,
      user,
      address: request,
    });
    const result: Result<UserAddressEntity> = await this.commandBus.execute(
      command,
    );

    return new DataResponseBase(result.unwrap((a) => new AddressResponse(a)));
  }
}
