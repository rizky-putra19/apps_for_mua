import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import {
  DomainEvent,
  DomainEventHandler,
} from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { ResendVerificationQuery } from '@src/modules/profile/queries/resend-verification/resend-verification.query';
import { UserCreatedDomainEvent } from '../../domain/events/user-created.domain-event';

@Injectable()
export class SendVerifyEmailWhenUserIsCreatedDomainEventHandler extends DomainEventHandler {
  constructor(private readonly queryBus: QueryBus) {
    super(UserCreatedDomainEvent);
  }
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    const { email, type, name } = event;
    const result: Result<ID, Error> = await this.queryBus.execute(
      new ResendVerificationQuery({
        email: new Email(email),
        name: name,
        type: type,
      }),
    );
  }
}
