import { Result } from '@badrap/result';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { ValidateOtpRequest } from './validate-otp.dto';
import { ValidateOtpQuery } from './validate-otp.query';

@Controller('/challenges')
export class ValidateOtpHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('/validate')
  @HttpCode(200)
  async validate(@Body() request: ValidateOtpRequest) {
    const result: Result<OtpEntity> = await this.queryBus.execute(
      new ValidateOtpQuery({
        code: request.secret,
        identifier: request.descriptor,
        userType: UserType[request.userType.toLocaleUpperCase()],
      }),
    );

    return new DataResponseBase(
      result.unwrap((o) => {
        const { secret, identifier } = o.getPropsCopy();
        return {
          token: secret,
          descriptor: identifier,
          type: 'phone',
        };
      }),
    );
  }
}
