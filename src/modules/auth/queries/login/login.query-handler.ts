import { Result } from '@badrap/result';
import { Inject } from '@nestjs/common';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import {
  BadRequestException,
  UnauthorizedException,
} from '@src/libs/exceptions';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';
import { OtpEntity } from '@src/modules/otp/domain/entities/otp.entity';
import { GetOtpBySecretQuery } from '@src/modules/otp/queries/get-otp-by-secret/get-otp-by-secret.query';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { TokenEntity } from '../../domain/entities/token.entity';
import { GrantType } from '../../domain/enums/grant-type.enum';
import { LoginHandler } from './login-handler.interface';
import { LoginQuery } from './login.query';

@QueryHandler(LoginQuery)
export class LoginQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtFactory: JwtTokenFactory,
    private readonly queryBus: QueryBus,
    @Inject('LOGIN_HANDLERS')
    private readonly loginHandlers: Map<GrantType, LoginHandler>,
  ) {
    super();
  }
  async handle(query: LoginQuery): Promise<Result<TokenEntity, Error>> {
    const { grantType, password } = query.request;
    if (grantType == 'guest') {
      const token = await this.jwtFactory.createGuestToken();
      return Result.ok(
        new TokenEntity({
          accessToken: token.getToken(),
          tokenType: 'bearer',
          expiresIn: token.expires,
        }),
      );
    }

    const handlers = this.loginHandlers.get(GrantType[grantType.toUpperCase()]);

    if (!handlers) {
      throw new BadRequestException('Invalid grant type');
    }

    const userEntity = await handlers.authenticate(query.request);

    let previousGrantType: string = null;
    if (grantType == 'refresh_token') {
      const expiredTokenClaim: JwtPayload = this.jwtFactory.getExpiredClaims(
        password,
      ) as JwtPayload;
      previousGrantType = expiredTokenClaim.grant_type;
    }
    const accessToken = await this.jwtFactory.createAccessToken(
      userEntity.id.value,
      grantType,
      previousGrantType,
    );
    const refreshToken = await this.jwtFactory.createRefreshToken(
      accessToken.jwtPayload,
    );

    return Result.ok(
      new TokenEntity({
        accessToken: accessToken.getToken(),
        expiresIn: accessToken.expires,
        refreshToken: refreshToken.getToken(),
        tokenType: 'bearer',
      }),
    );
  }

  async handleByGrantType(
    grantType: string,
    identifier: string,
    password?: string,
  ): Promise<UserEntity> {
    switch (grantType) {
      case 'phone':
        const res: Result<OtpEntity> = await this.queryBus.execute(
          new GetOtpBySecretQuery({ secret: identifier }),
        );
        const props = res.unwrap().getPropsCopy();
        return this.userRepository.findOneOrThrow({
          phoneNumber: props.identifier,
        });
    }
  }

  handleRefreshToken(identifier: string, password: string) {
    return '';
  }
}
