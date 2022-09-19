import { Result } from '@badrap/result';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { NotFoundException } from '@src/libs/exceptions';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import { UserNotFoundError } from '../../errors/user.errors';
import { FindUserQuery } from './find-user.query';
import { FindUserRequest } from './find-user.request.dto';

@Controller({
  version: '1',
  path: routesApiV1.app.users.root,
})
export class FindUserHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('/find')
  @HttpCode(200)
  async findUser(@Body() request: FindUserRequest) {
    const query = new FindUserQuery({
      identifier: request.identifier,
      userType: request.type,
      findType: request.findType,
    });
    const result: Result<UserEntity, UserNotFoundError> =
      await this.queryBus.execute(query);

    return new DataResponseBase(result.unwrap((u) => new UserResponse(u)));
  }
}
