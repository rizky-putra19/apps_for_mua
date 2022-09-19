import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FacebookClient } from '@src/libs/ddd/http/facebook.client';
import { UnauthorizedException } from '@src/libs/exceptions';
import { GrantType } from '@src/modules/auth/domain/enums/grant-type.enum';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FindUserQuery } from '@src/modules/user/queries/find-user/find-user.query';
import { LoginHandler } from '../login-handler.interface';
import { LoginRequest } from '../login.request.dto';

@Injectable()
export class FacebookLoginHandler extends LoginHandler {
  constructor(
    private readonly facebookClient: FacebookClient,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }
  async authenticate(request: LoginRequest): Promise<UserEntity> {
    const res = await this.facebookClient.getUserInfo(request.identifier);

    const user: Result<UserEntity> = await this.queryBus.execute(
      new FindUserQuery({
        findType: 'email',
        identifier: res.email,
        userType: this.getScopeByGrantType(
          GrantType[request.grantType.toUpperCase()],
        ),
      }),
    );

    if (user == undefined) {
      throw new UnauthorizedException('user not found');
    }

    return user.unwrap();
  }
}
