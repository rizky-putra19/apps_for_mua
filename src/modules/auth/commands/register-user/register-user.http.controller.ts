import { Result } from '@badrap/result';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { Id } from '@src/libs/ddd/interface-adapters/interfaces/id.interface';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserAlreadyExistsError } from '@src/modules/user/errors/user.errors';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserRequest } from './register-user.dto';

@Controller('/accounts')
export class RegisterUserController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('/register')
  async registerUser(@Body() request: RegisterUserRequest) {
    const command = new RegisterUserCommand({
      challengeToken: request.challengeToken,
      email: new Email(request.email),
      gender: request.gender,
      password: request.email,
      type: request.type,
      appleId: request.appleId,
      facebookId: request.appleId,
      googleId: request.appleId,
      name: request.name,
      username: request.username,
      birthdate: request.birthdate,
      instagram: request.instagram,
      categories: request.categories,
    });

    const result: Result<ID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);
    return result.unwrap((u) => {
      return new DataResponseBase(new IdResponse(u.value));
    });
  }
}
