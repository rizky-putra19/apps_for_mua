import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestOtpCommandHandler } from './commands/request-otp/request-otp.command-handler';
import { RequestOtpController } from './commands/request-otp/request-otp.http.controller';
import { OtpOrmEntity } from './database/otp.orm-entity';
import { OtpRepository } from './database/otp.repository';
import { sendOtpEventOtpEvent } from './otp.provider';
import { GetOtpByIdentifierHttpController } from './queries/get-otp-by-identifier/get-otp-by-identifier.http.controller';
import { GetOtpByIdentifierQueryHandler } from './queries/get-otp-by-identifier/get-otp-by-identifier.query-handler';
import { GetOtpBySecretHttpController } from './queries/get-otp-by-secret/get-otp-by-secret.http-controller';
import { GetOtpBySecretQueryHandler } from './queries/get-otp-by-secret/get-otp-by-secret.query-handler';

import { ValidateOtpHttpController } from './queries/validate-otp/validate-otp.http.controller';
import { ValidateOtpQueryHandler } from './queries/validate-otp/validate-otp.query-handler';

const queryHandlers = [
  GetOtpByIdentifierQueryHandler,
  ValidateOtpQueryHandler,
  GetOtpBySecretQueryHandler,
];
const commandHandlers = [RequestOtpCommandHandler];

@Module({
  imports: [TypeOrmModule.forFeature([OtpOrmEntity]), CqrsModule],
  controllers: [
    RequestOtpController,
    GetOtpByIdentifierHttpController,
    ValidateOtpHttpController,
    GetOtpBySecretHttpController,
  ],
  providers: [
    sendOtpEventOtpEvent,
    OtpRepository,
    ...queryHandlers,
    ...commandHandlers,
  ],
  exports: [...queryHandlers, ...commandHandlers],
})
export class OtpModule {}
