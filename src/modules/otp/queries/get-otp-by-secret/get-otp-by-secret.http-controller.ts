import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Result } from '@badrap/result';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { GetOtpBySecretQuery } from '../get-otp-by-secret/get-otp-by-secret.query';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
@Controller('/challenges')
export class GetOtpBySecretHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:secret')
  async getOtpBySecret(@Param('secret') secret: string) {
    const result: Result<OtpEntity> = await this.queryBus.execute(
      new GetOtpBySecretQuery({ secret }),
    );
    return new DataResponseBase(
      result.unwrap((o) => {
        const { secret, identifier, type, userType } = o.getPropsCopy();
        return {
          token: secret,
          descriptor: identifier,
          type: type,
          user_type: userType,
        };
      }),
    );
  }
}
