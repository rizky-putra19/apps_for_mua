import { Result } from '@badrap/result';
import { Body, Controller, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { ForgotPasswordRequest } from './forgot-password.dto';
import { ForgotPasswordQuery } from './forgot-password.query';

@Controller('/accounts')
export class ForgotPasswordHttpController {
  constructor(protected readonly queryBus: QueryBus) {}
  @Post('/forgot-password')
  async forgotPassword(@Body() request: ForgotPasswordRequest) {
    const result: Result<ID> = await this.queryBus.execute(
      new ForgotPasswordQuery({
        email: new Email(request.email),
        type: request.type,
      }),
    );

    return new DataResponseBase(
      result.unwrap((id) => new IdResponse(id.value)),
    );
  }
}
