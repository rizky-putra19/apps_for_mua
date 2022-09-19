import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryHandler } from '@nestjs/cqrs';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { RequestOtpCommand } from '@src/modules/otp/commands/request-otp/request-otp.command';
import { OtpEntity } from '@src/modules/otp/domain/entities/otp.entity';
import { OtpType } from '@src/modules/otp/domain/enums/otp-type.enum';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ResendVerificationQuery } from './resend-verification.query';

@QueryHandler(ResendVerificationQuery)
export class ResendVerificationQueryHandler extends QueryHandlerBase {
  private appUrl: string;
  constructor(
    private readonly mailgunClient: MailgunClient,
    private readonly configService: ConfigService,
    private readonly firebaseClient: FirebaseClient,
    private readonly commandBus: CommandBus,
  ) {
    super();

    this.appUrl = this.configService.get('appUrl');
  }
  async handle(query: ResendVerificationQuery): Promise<Result<ID, Error>> {
    const { email, type, name, id } = query;

    const secret = await this.createSecret(email.value, type.toLowerCase());
    const code = Buffer.from(`${secret}:${email.value}:${type}`).toString(
      'base64',
    );

    const link = await this.firebaseClient.generateShortlink(
      `${this.appUrl}/auth/verify?code=${code}`,
      type,
    );

    await this.mailgunClient.sendEmail(
      email.value,
      'Verify Email',
      this.getTemplateByScope(type),
      {
        name: name,
        verify_url: link,
      },
    );
    return Result.ok(id || UUID.generate());
  }
  getTemplateByScope(scope: UserType): string {
    switch (scope) {
      case UserType.CUSTOMER:
        return 'beb_cust_mail_verifyemail';
      case UserType.ARTISAN:
        return 'beb_artisan_newartisan-pleaseconfirmemail';
    }
  }

  async createSecret(email: string, userType: string) {
    const otp: Result<OtpEntity> = await this.commandBus.execute(
      new RequestOtpCommand({
        identifier: email,
        userType: UserType[userType.toUpperCase()],
        type: OtpType.EMAIL,
      }),
    );
    const result = otp.unwrap().getPropsCopy();
    return result.secret;
  }
}
