import { Result } from '@badrap/result';
import { ConfigService } from '@nestjs/config';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { NotFoundException } from '@src/libs/exceptions';
import moment from 'moment';
import { OtpRepository } from '../../database/otp.repository';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { InvalidOtpError } from '../../errors/invalid-otp.error';
import { MaxRetryError } from '../../errors/max-retry.error';
import { GetOtpByIdentifierQuery } from '../get-otp-by-identifier/get-otp-by-identifier.query';
import { ValidateOtpQuery } from './validate-otp.query';

@QueryHandler(ValidateOtpQuery)
export class ValidateOtpQueryHandler extends QueryHandlerBase {
  private maxValidationAttempt: number;
  constructor(
    private readonly queryBus: QueryBus,
    private readonly otpRepository: OtpRepository,
    readonly configService: ConfigService,
  ) {
    super();
    this.maxValidationAttempt = configService.get('otpMaxValidationAttempt');
  }
  async handle({
    identifier,
    userType,
    code,
  }: ValidateOtpQuery): Promise<Result<OtpEntity, NotFoundException>> {
    const commandResult: Result<OtpEntity> = await this.queryBus.execute(
      new GetOtpByIdentifierQuery({
        identifier: identifier,
        userType: userType,
      }),
    );
    const otp = commandResult.unwrap().getPropsCopy();

    if (otp.validationAttempts >= this.maxValidationAttempt) {
      throw new MaxRetryError('Maximum validation attempt exceeded!');
    }

    if (otp.code != code) {
      throw new InvalidOtpError(
        'The OTP code you’ve entered is incorrect! Please try again.',
      );
    }
    const result = await this.otpRepository.save(
      new OtpEntity({
        id: otp.id,
        props: {
          ...otp,
          validationAttempts: otp.validationAttempts + 1,
        },
      }),
    );
    return Result.ok(result);
  }
}
