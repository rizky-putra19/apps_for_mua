import { Injectable } from '@nestjs/common';
import { GrantType } from '@src/modules/auth/domain/enums/grant-type.enum';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { LoginHandler } from '../login-handler.interface';
import { LoginRequest } from '../login.request.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@src/libs/exceptions';
import { QueryBus } from '@nestjs/cqrs';
import { FindUserQuery } from '@src/modules/user/queries/find-user/find-user.query';
import { Result } from '@badrap/result';

@Injectable()
export class GoogleLoginHandler extends LoginHandler {
  private client: OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super();
    this.client = new OAuth2Client();
  }
  async authenticate(request: LoginRequest): Promise<UserEntity> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: request.identifier,
        audience: this.configService
          .get<string>('http.google.clientIds')
          .split(','),
      });
      const payload = ticket.getPayload();
      const email = payload['email'];

      const user: Result<UserEntity> = await this.queryBus.execute(
        new FindUserQuery({
          findType: 'email',
          identifier: email,
          userType: this.getScopeByGrantType(
            GrantType[request.grantType.toUpperCase()],
          ),
        }),
      );
      return user.unwrap();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
