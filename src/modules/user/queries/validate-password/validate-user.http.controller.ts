import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { BadRequestException } from '@src/libs/exceptions/bad-request.exception';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import {
  InvalidPasswordError,
  UserNotFoundError,
} from '../../errors/user.errors';
import { ValidatePasswordRequest } from './validate-password.request.dto';
import { ValidateUserQuery } from './validate-user.query';

@Controller({
  version: '1',
  path: routesApiV1.app.users.root,
})
export class ValidatePasswordHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @Post(routesApiV1.app.users.validate)
  @HttpCode(200)
  async validatePassword(@Body() request: ValidatePasswordRequest) {
    const query = new ValidateUserQuery({
      email: new Email(request.identifier),
      password: request.password,
      type: request.type,
    });
    const result: Result<UserEntity, InvalidPasswordError> =
      await this.queryBus.execute(query);

    return new DataResponseBase(
      result.unwrap(
        (u) => new UserResponse(u),
        (error) => {
          if (error instanceof InvalidPasswordError) {
            throw new BadRequestException(error.message);
          }
          throw error;
        },
      ),
    );
  }
}
