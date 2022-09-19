import { Result } from '@badrap/result';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { ProfileQuery } from './profile.query';

@Controller({
  version: '1',
  path: '/profile',
})
export class ProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @UseGuards(AuthGuard('custom'))
  async profile(@User() user: UserEntity) {
    const result: Result<UserEntity> = await this.queryBus.execute(
      new ProfileQuery({
        user,
      }),
    );
    return new DataResponseBase(result.unwrap((u) => new UserResponse(u)));
  }
}
