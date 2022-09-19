import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { ConflictException } from '@src/libs/exceptions';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserAlreadyExistsError } from '../../errors/user.errors';
import { CreateUserCommand } from './create-user.command';
import { CreateUserRequest } from './create-user.request.dto';

@Controller({
  version: '1',
  path: routesApiV1.app.users.root,
})
export class CreateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: CreateUserRequest) {
    const command = new CreateUserCommand({
      email: body.email,
      password: body.password,
      name: body.name,
      type: body.type,
      status: UserStatus.UNVERIFIED_EMAIL,
      facebookId: body.facebookId,
      googleId: body.googleId,
      gender: body.gender,
      appleId: body.appleId,
      phoneNumber: body.phoneNumber,
      categories: body.categories,
      username: body.username,
      instagram: body.instagram,
      birthdate: body.birthdate,
    });
    const result: Result<ID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);
    return result.unwrap(
      (id) => new DataResponseBase(new IdResponse(id.value)), // if ok return an id
    );
  }
}
