import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { User } from '@src/infrastructure/decorators';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { NotFoundException } from '@src/libs/exceptions';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import { UserNotFoundError } from '../../errors/user.errors';
import { GetUserLegacyQuery } from './get-user-legacy.query';
import { GetArtisanQuery } from './get-user.query';

@Controller({
  version: '1',
  path: routesApiV1.app.users.root,
})
export class GetUserHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/legacy/:legacyId')
  async showLegacy(@Param('legacyId') legacyId: number) {
    const result: Result<UserEntity, Error> = await this.queryBus.execute(
      new GetUserLegacyQuery({ legacyId }),
    );

    return new DataResponseBase(result.unwrap((u) => new UserResponse(u)));
  }

  @Get(routesApiV1.app.users.show)
  @UseGuards(AuthGuard('custom'))
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: UserNotFoundError.message,
  })
  async show(@Param('id') userId: string, @User() user: UserEntity) {
    const query = new GetArtisanQuery({
      userId,
      user,
    });
    const result: Result<UserEntity> = await this.queryBus.execute(query);
    return new DataResponseBase(
      result.unwrap(
        (e) => new UserResponse(e),
        (error) => {
          if (error instanceof UserNotFoundError) {
            throw new NotFoundException(error.message);
          }
          throw error;
        },
      ),
    );
  }
}
