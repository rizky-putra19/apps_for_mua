import { Result } from '@badrap/result';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GetAddressesQuery } from '@src/modules/user/queries/get-addresses/get-addresses.query';
import { AddressResponse } from '../../dtos/address.response.dto';

@Controller({
  version: '1',
  path: '/profile',
})
export class GetAddressesHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('address')
  @UseGuards(AuthGuard('custom'))
  async show(@User() user: UserEntity) {
    const result: Result<DataAndCountMeta<UserAddressEntity[]>> =
      await this.queryBus.execute(
        new GetAddressesQuery({
          user,
        }),
      );

    return result.unwrap((a) => {
      const { data, count } = a;
      return new DataListResponseBase(
        data.map((d) => new AddressResponse(d)),
        { count },
      );
    });
  }
}
