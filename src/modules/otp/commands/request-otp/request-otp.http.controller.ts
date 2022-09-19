import { Result } from '@badrap/result';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Phone } from '@src/infrastructure/domain/value-objects/phone.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpType } from '../../domain/enums/otp-type.enum';
import { OtpResponse } from '../../dtos/otp.response';
import { RequestOtpCommand } from './request-otp.command';
import { RequestOtpRequest } from './request-otp.dto';

@Controller('/challenges')
export class RequestOtpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async requestOtp(@Body() request: RequestOtpRequest) {
    const result: Result<OtpEntity, Error> = await this.commandBus.execute(
      new RequestOtpCommand({
        identifier: request.descriptor,
        userType: UserType[request.userType.toUpperCase()],
        type: OtpType.PHONE,
      }),
    );
    return new DataResponseBase(result.unwrap((o) => new OtpResponse(o)));
  }
}
