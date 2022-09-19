import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  BadRequestException,
  UnauthorizedException,
} from '@src/libs/exceptions';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FindUserQuery } from '@src/modules/user/queries/find-user/find-user.query';
import { LoginHandler } from '../login-handler.interface';
import { LoginRequest } from '../login.request.dto';
import { compareSync } from 'bcrypt';
import { Result } from '@badrap/result';
import { GrantType } from '@src/modules/auth/domain/enums/grant-type.enum';

@Injectable()
export class PasswordLoginHandler extends LoginHandler {
  constructor(private readonly queryBus: QueryBus) {
    super();
  }
  async authenticate(request: LoginRequest): Promise<UserEntity> {
    try {
      const user: Result<UserEntity> = await this.queryBus.execute(
        new FindUserQuery({
          findType: 'email',
          identifier: request.identifier,
          userType: this.getScopeByGrantType(
            GrantType[request.grantType.toUpperCase()],
          ),
        }),
      );
      const props = user.unwrap().getPropsCopy();

      if (!compareSync(request.password, props.password)) {
        throw new UnauthorizedException(
          'The email or password you entered is incorrect',
        );
      }
      return user.unwrap();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
