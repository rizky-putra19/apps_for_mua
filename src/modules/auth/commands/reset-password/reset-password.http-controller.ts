import { Result } from '@badrap/result';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ForgotPasswordCommand } from '../forgot-password/forgot-password.command';
import { ResetPasswordRequest } from './reset-password.dto';

@Controller('/accounts')
export class ResetPasswordHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('/reset-password')
  @HttpCode(200)
  async resetPassword(@Body() request: ResetPasswordRequest) {
    const [email] = Buffer.from(request.token, 'base64')
      .toString('ascii')
      .split(':');
    const result: Result<UserEntity, Error> = await this.commandBus.execute(
      new ForgotPasswordCommand({
        code: request.token,
        email: new Email(email),
        newPassword: request.password,
      }),
    );

    return new DataResponseBase(
      result.unwrap((u) => new IdResponse(u.id.value)),
    );
  }
}
