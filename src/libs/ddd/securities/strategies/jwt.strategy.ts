import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from '@badrap/result';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GetUserQuery } from '@src/modules/user/queries/get-user/get-user.query';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: configService.get('jwtPublicKey').replace(/\\n/gm, '\n'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.grant_type == 'guest') {
      return {};
    }
    const user: Result<UserEntity> = await this.queryBus.execute(
      new GetUserQuery({ userId: payload.sub }),
    );

    return user.unwrap();
  }
}
