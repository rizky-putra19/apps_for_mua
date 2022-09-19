import { Result } from '@badrap/result';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { CacheService } from '@src/libs/ddd/infrastructure/cache/cache.service';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FindUserQuery } from '@src/modules/user/queries/find-user/find-user.query';
import { ForgotPasswordQuery } from './forgot-password.query';
import * as moment from 'moment';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

@QueryHandler(ForgotPasswordQuery)
export class ForgotPasswordQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
    private readonly mailgunClient: MailgunClient,
    private readonly cacheService: CacheService,
    private readonly firebaseClient: FirebaseClient,
  ) {
    super();
  }
  async handle(query: ForgotPasswordQuery): Promise<Result<ID, Error>> {
    const { email, type } = query;
    const result: Result<UserEntity> = await this.queryBus.execute(
      new FindUserQuery({
        findType: 'email',
        userType: type,
        identifier: email.value,
      }),
    );

    const res = await this.cacheService.get(
      `forgot-password:${email.value}:${type}`,
      String,
    );

    if (res) {
      this.cacheService.remove(`forgot-password:${email.value}:${type}`);
      this.cacheService.remove(`forgot-token:${res}`);
    }

    const user = result.unwrap().getPropsCopy();
    const code = Buffer.from(
      `${email.value}:${type}:${UUID.generate().value}`,
    ).toString('base64');
    this.cacheService.set(`forgot-token:${code}`, code, 3600);
    this.cacheService.set(`forgot-password:${email.value}:${type}`, code, 3600);

    const link = await this.firebaseClient.generateShortlink(
      `${this.configService.get('appUrl')}/auth/forgot-password?code=${code}`,
      UserType[type.toUpperCase()],
    );

    const mailgunResult = await this.mailgunClient.sendEmail(
      email.value,
      'Reset Password',
      this.getTemplateId(UserType[type.toUpperCase()]),
      {
        name: user.name,
        reset_link: link,
      },
    );

    return Promise.resolve(Result.ok(result.unwrap((u) => u.id)));
  }

  getTemplateId(userType: UserType) {
    switch (userType) {
      case UserType.ARTISAN:
        return 'beb_artisan_email_requestresetpassword';
      case UserType.CUSTOMER:
        return 'beb_cust_mail_resetpassword';
      default:
        return 'beb_cust_mail_resetpassword';
    }
  }
}
