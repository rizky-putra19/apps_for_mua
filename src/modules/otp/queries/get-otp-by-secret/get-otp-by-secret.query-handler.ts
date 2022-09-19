import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import moment from 'moment';
import { OtpRepository } from '../../database/otp.repository';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { InvalidOtpError } from '../../errors/invalid-otp.error';
import { GetOtpBySecretQuery } from './get-otp-by-secret.query';

@QueryHandler(GetOtpBySecretQuery)
export class GetOtpBySecretQueryHandler extends QueryHandlerBase {
  constructor(private readonly otpRepository: OtpRepository) {
    super();
  }
  async handle(query: GetOtpBySecretQuery): Promise<Result<OtpEntity, Error>> {
    const otp = await this.otpRepository.findOneOrThrow({
      secret: query.secret,
    });
    if (otp != null) {
      const otpProps = otp.getPropsCopy();
      const currentDate = moment();
      const expiredAt = moment(otpProps.expiresAt);

      if (expiredAt.isBefore(currentDate)) {
        throw new InvalidOtpError('Token has expired');
      }
      return Result.ok(otp);
    }

    throw new InvalidOtpError('Invalid otp token');
  }
}
