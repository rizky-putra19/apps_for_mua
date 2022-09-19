import { HttpService } from '@nestjs/axios';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import { JwtFactoryUtil } from '@src/libs/utils/jwt-factory.util';
import { SendVerifyEmailWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/send-verfify-email-when-user-is-created.domain-event.handler';

/* Constructing custom providers
 */
export const createUserCliLoggerSymbol = Symbol('createUserCliLoggerSymbol');

export const createUserCliLoggerProvider: Provider = {
  provide: createUserCliLoggerSymbol,
  useFactory: (): Logger => {
    return new Logger('create-user-cli');
  },
};

export const sendVerifyEmailWhenUserCreated: Provider = {
  provide: SendVerifyEmailWhenUserIsCreatedDomainEventHandler,
  useFactory: (
    queryBus: QueryBus,
  ): SendVerifyEmailWhenUserIsCreatedDomainEventHandler => {
    const eventHandler = new SendVerifyEmailWhenUserIsCreatedDomainEventHandler(
      queryBus,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [QueryBus],
};

export const jwtUtil: Provider = {
  provide: JwtFactoryUtil,
  useFactory: (configService: ConfigService): JwtFactoryUtil => {
    return new JwtFactoryUtil(configService);
  },
  inject: [ConfigService],
};
