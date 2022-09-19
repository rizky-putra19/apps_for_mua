import { Result } from '@badrap/result';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { OtpResponse } from '../../dtos/otp.response';
import { GetOtpByIdentifierQuery } from './get-otp-by-identifier.query';

@Controller('/challenges')
export class GetOtpByIdentifierHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/descriptor/:type/:identifier/:userType')
  async getByIdentifier(
    @Param('identifier') identifier: string,
    @Param('userType') userType: string,
  ) {
    const result: Result<OtpEntity> = await this.queryBus.execute(
      new GetOtpByIdentifierQuery({
        identifier,
        userType: UserType[userType.toUpperCase()],
      }),
    );

    return new DataResponseBase(
      result.unwrap((o) => {
        const props = o.getPropsCopy();
        return {
          descriptor: props.identifier,
          secret: props.code,
          type: 'phone',
          userType: props.userType,
        };
      }),
    );
  }
}
