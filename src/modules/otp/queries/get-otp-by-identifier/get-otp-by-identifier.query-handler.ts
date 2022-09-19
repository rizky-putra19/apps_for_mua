import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { NotFoundException } from '@src/libs/exceptions';
import moment from 'moment';
import { MoreThan } from 'typeorm';
import { OtpRepository } from '../../database/otp.repository';
import { OtpEntity } from '../../domain/entities/otp.entity';
import { GetOtpByIdentifierQuery } from './get-otp-by-identifier.query';

@QueryHandler(GetOtpByIdentifierQuery)
export class GetOtpByIdentifierQueryHandler extends QueryHandlerBase {
  constructor(private readonly otpRepository: OtpRepository) {
    super();
  }
  async handle(
    query: GetOtpByIdentifierQuery,
  ): Promise<Result<OtpEntity, Error>> {
    const expireTime = moment().format('YYYY-MM-DD hh:mm:ss');
    console.log(
      '🚀 ~ file: get-otp-by-identifier.query-handler.ts ~ line 20 ~ GetOtpByIdentifierQueryHandler ~ expireTime',
      expireTime,
    );
    const otp = await this.otpRepository.findOneRaw({
      where: {
        identifier: query.identifier,
        expiresAt: MoreThan(expireTime),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!otp) {
      throw new NotFoundException('Invalid descriptor');
    }
    return Result.ok(otp);
  }
}
