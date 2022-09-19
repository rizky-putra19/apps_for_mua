import { Result } from '@badrap/result';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { User } from '@src/infrastructure/decorators';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import { FindArtisanCustomerListQuery } from './find-artisan-customer-list.query';
import { FindArtisanCustomerListQueryParams } from './find-artisan-customer-list.query-params';

@Controller({
  version: '1',
  path: routesApiV1.app.users.root,
})
export class FindArtisanCustomerListHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/list-users/:userType')
  @UseGuards(AuthGuard('custom'))
  async index(
    @User() user: UserEntity,
    @Param('userType') userType: string,
    @Query() params: FindArtisanCustomerListQueryParams,
  ) {
    const result: Result<DataWithPaginationMeta<UserEntity[]>> =
      await this.queryBus.execute(
        new FindArtisanCustomerListQuery({
          user,
          userType,
          params,
        }),
      );
    const { data, count, limit, page } = result.unwrap();
    return new DataListResponseBase(
      data.map((u) => new UserResponse(u)),
      { count, limit, page },
    );
  }
}
