import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, QueryBus } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { OtpEntity } from '@src/modules/otp/domain/entities/otp.entity';
import { GetOtpBySecretQuery } from '@src/modules/otp/queries/get-otp-by-secret/get-otp-by-secret.query';
import {
  UserEntity,
  UserProps,
} from '@src/modules/user/domain/entities/user.entity';
import { UserStatus } from '@src/modules/user/domain/enums/user-status.enum';
import { UserNotFoundError } from '@src/modules/user/errors/user.errors';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { VerifyUserCommand } from './verify-user.command';

@CommandHandler(VerifyUserCommand)
export class VerifyUserCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly queryBus: QueryBus,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: VerifyUserCommand,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    try {
      const result: Result<OtpEntity> = await this.queryBus.execute(
        new GetOtpBySecretQuery({ secret: command.token }),
      );
      const otp = result.unwrap().getPropsCopy();

      const userRepo = this.unitOfWork.getUserRepository(command.correlationId);

      const user = await userRepo.findOneByEmailAndTypeOrThrow(
        otp.identifier,
        command.userType,
      );

      const userProps = user.getPropsCopy();

      if (userProps.status == 'active') {
        throw new BadRequestException('User is already verified');
      }

      const updateData: UserProps = {
        ...user.getPropsCopy(),
        status: UserStatus.ACTIVE,
      };

      const updatedUser = await userRepo.save(
        new UserEntity({ id: user.id, props: updateData }),
      );

      return Result.ok(updatedUser);
    } catch (err) {
      console.log(
        '🚀 ~ file: verify-user.command-handler.ts ~ line 60 ~ VerifyUserCommandHandler ~ err',
        err,
      );
      return Result.err(err);
    }
  }
}
