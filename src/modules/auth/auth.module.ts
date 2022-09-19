import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@src/infrastructure/auth/auth.service';
import { CustomStrategy } from '@src/infrastructure/auth/strategies/custom.strategies';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import { CacheService } from '@src/libs/ddd/infrastructure/cache/cache.service';
import { RedisCache } from '@src/libs/ddd/infrastructure/cache/redis.cache';
import { HttpStrategy } from '@src/libs/ddd/securities/strategies/http.strategy';
import { JwtStrategy } from '@src/libs/ddd/securities/strategies/jwt.strategy';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';
import { UserModule } from '../user/user.module';
import { ForgotPasswordCommandHandler } from './commands/forgot-password/forgot-password.command-handler';
import { ForgotPasswordHttpViewController } from './commands/forgot-password/forgot-password.http-view.controller';
import { RegisterUserCommandHandler } from './commands/register-user/register-user.command-handler';
import { RegisterUserController } from './commands/register-user/register-user.http.controller';

import { ResetPasswordHttpController } from './commands/reset-password/reset-password.http-controller';
import { VerifyUserCommandHandler } from './commands/verify-user/verify-user.command-handler';
import { VerifyUserHttpViewController } from './commands/verify-user/verify-user.http-view.controller';
import { ApiClientOrmEntity } from './database/api-client-orm-entity';
import { ApiClientRepository } from './database/api-client.repository';
import { GrantType } from './domain/enums/grant-type.enum';
import { AuthValidateQueryHandler } from './queries/auth-validate/auth-validate.query-handler';
import { AuthHttpController } from './queries/auth-validate/auth.http.controller';
import { FindApiClientQuery } from './queries/find-api-client/find-api-client.query';
import { FindApiQueryHandler } from './queries/find-api-client/find-api-client.query-handler';
import { ForgotPasswordHttpController } from './queries/forgot-password/forgot-password.http.controller';
import { ForgotPasswordQueryHandler } from './queries/forgot-password/forgot-password.query-handler';
import { LoginHandler } from './queries/login/login-handler.interface';
import { GoogleLoginHandler } from './queries/login/login-handlers/google.login-handler';
import { PasswordLoginHandler } from './queries/login/login-handlers/password.login-handler';
import { PhoneLoginHandler } from './queries/login/login-handlers/phone.login-handler';
import { RefreshTokenHandler } from './queries/login/login-handlers/refresh-token.login-handler';
import { LoginController } from './queries/login/login.http.controller';
import { LoginQueryHandler } from './queries/login/login.query-handler';

const commandHandlers = [
  RegisterUserCommandHandler,
  VerifyUserCommandHandler,
  ForgotPasswordCommandHandler,
];
const queries = [
  ForgotPasswordQueryHandler,
  AuthValidateQueryHandler,
  FindApiQueryHandler,
  LoginQueryHandler,
];
const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const options: JwtModuleOptions = {
      privateKey: configService.get('jwtPrivateKey').replace(/\\n/gm, '\n'),
      publicKey: configService.get('jwtPublicKey').replace(/\\n/gm, '\n'),
      signOptions: {
        expiresIn: '5m',
        issuer: 'Beautybell-V2',
        algorithm: 'RS256',
      },
    };
    return options;
  },
  inject: [ConfigService],
});
@Module({
  imports: [
    CqrsModule,
    HttpModule,
    UserModule,
    TypeOrmModule.forFeature([ApiClientOrmEntity]),
    jwtModule,
  ],
  controllers: [
    RegisterUserController,
    VerifyUserHttpViewController,
    ForgotPasswordHttpController,
    ForgotPasswordHttpViewController,
    ResetPasswordHttpController,
    AuthHttpController,
    LoginController,
  ],
  providers: [
    HttpStrategy,
    JwtStrategy,
    AuthService,
    CustomStrategy,
    ...commandHandlers,
    ...queries,
    MailgunClient,
    FirebaseClient,
    JwtTokenFactory,
    PhoneLoginHandler,
    RefreshTokenHandler,
    PasswordLoginHandler,
    GoogleLoginHandler,
    ApiClientRepository,
    {
      provide: CacheService,
      useFactory: (config) => {
        return new CacheService(new RedisCache(config));
      },
      inject: [ConfigService],
    },
    {
      provide: 'LOGIN_HANDLERS',
      useFactory: (
        refreshTokenHandler: RefreshTokenHandler,
        passwordTokenHandler: PasswordLoginHandler,
        googleTokenHandler: GoogleLoginHandler,
      ): Map<GrantType, LoginHandler> => {
        const handlers = new Map();
        handlers.set(GrantType.GOOGLE, googleTokenHandler);
        handlers.set(GrantType.GOOGLE_ARTISAN, googleTokenHandler);
        handlers.set(GrantType.PASSWORD, passwordTokenHandler);
        handlers.set(GrantType.PASSWORD_ARTISAN, passwordTokenHandler);
        handlers.set(GrantType.REFRESH_TOKEN, refreshTokenHandler);
        return handlers;
      },
      inject: [RefreshTokenHandler, PasswordLoginHandler, GoogleLoginHandler],
    },
  ],
  exports: [AuthService, jwtModule, JwtTokenFactory],
})
export class AuthModule {}
