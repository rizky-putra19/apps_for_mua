import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OtpEntity } from '@src/modules/otp/domain/entities/otp.entity';
import { GetOtpBySecretQuery } from '@src/modules/otp/queries/get-otp-by-secret/get-otp-by-secret.query';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { LoginHandler } from '../login-handler.interface';
import { LoginRequest } from '../login.request.dto';

@Injectable()
export class PhoneLoginHandler extends LoginHandler {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }
  async authenticate(request: LoginRequest): Promise<UserEntity> {
    const res: Result<OtpEntity> = await this.queryBus.execute(
      new GetOtpBySecretQuery({ secret: request.identifier }),
    );
    const props = res.unwrap().getPropsCopy();
    return this.userRepository.findOneOrThrow({
      phoneNumber: props.identifier,
    });
  }
}
