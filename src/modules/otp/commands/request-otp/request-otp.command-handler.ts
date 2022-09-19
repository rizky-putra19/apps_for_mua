import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { OtpEntity, OtpProps } from '../../domain/entities/otp.entity';
import { RequestOtpCommand } from './request-otp.command';
import { MoreThan } from 'typeorm';
import moment from 'moment';
import { CodeGenerator } from '@src/libs/utils/code-generator.util';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { ConfigService } from '@nestjs/config';
import { MaxRetryError } from '../../errors/max-retry.error';
import { InvalidOtpError } from '../../errors/invalid-otp.error';
import { OtpType } from '../../domain/enums/otp-type.enum';

@CommandHandler(RequestOtpCommand)
export class RequestOtpCommandHandler extends CommandHandlerBase {
  private maxRetry: number;
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly configService: ConfigService,
  ) {
    super(unitOfWork);
    this.maxRetry = configService.get('OTP_MAX_RETRY');
  }
  async handle(command: RequestOtpCommand): Promise<Result<OtpEntity, Error>> {
    const otpRepository = this.unitOfWork.getOtpRepository(
      command.correlationId,
    );
    const currDate = moment(Date.now());

    const code = CodeGenerator.generate(6, {
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });
    let foundOtp = await otpRepository.findOneRaw({
      where: {
        identifier: command.identifier,
        expiresAt: MoreThan(currDate.format('YYYY-MM-DD HH:mm:ss')),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    let otp: OtpEntity;
    if (foundOtp) {
      const otpProps = foundOtp.getPropsCopy();
      const lastAttemptAt = moment(otpProps.lastAttemptAt);
      if (otpProps.attempts >= this.maxRetry) {
        throw new MaxRetryError(
          'You have exceeded the request for the OTP code! Please try again within 24 hours from now.',
        );
      }
      if (
        currDate.diff(lastAttemptAt, 'seconds') <
        this.configService.get<number>('OTP_STEP_REQUEST_TIME')
      ) {
        throw new InvalidOtpError(
          `Please wait in ${
            this.configService.get<number>('OTP_STEP_REQUEST_TIME') -
            currDate.diff(lastAttemptAt, 'seconds')
          } seconds`,
        );
      }

      otp = OtpEntity.update(otpProps.id, {
        attempts: otpProps.attempts + 1,
        lastAttemptAt: moment().toDate(),
        validationAttempts: 0,
        code,
        expiresAt: otpProps.expiresAt,
        identifier: otpProps.identifier,
        secret: UUID.generate().value,
        userType: otpProps.userType,
        type: otpProps.type,
      });
    } else {
      otp = OtpEntity.create({
        attempts: 0,
        code,
        expiresAt: moment()
          .add(this.configService.get<number>('OTP_VALIDITY'), 'seconds')
          .toDate(),
        validationAttempts: 0,
        identifier: command.identifier,
        secret: UUID.generate().value,
        userType: command.userType,
        type: command.type,
      });
    }

    const result = await otpRepository.save(otp);

    return Result.ok(result);
  }
}
