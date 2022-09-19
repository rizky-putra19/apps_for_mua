import { Result } from '@badrap/result';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { Request } from 'express';
import { ResendVerificationQuery } from './resend-verification.query';

@Controller({ version: '1', path: '/profile' })
export class ResendVerificationController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get('/resend-verification')
  @UseGuards(AuthGuard('custom'))
  async resendVerification(@Req() req: Request) {
    const user = (req.user as UserEntity).getPropsCopy();
    const result: Result<ID, Error> = await this.queryBus.execute(
      new ResendVerificationQuery({
        email: new Email(user.email),
        name: user.name,
        type: user.type,
        id: user.id,
      }),
    );

    return new DataResponseBase(
      result.unwrap((id) => new IdResponse(id.value)),
    );
  }
}
