import { Result } from '@badrap/result';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@src/libs/exceptions';
import { ApiClientEntity } from '@src/modules/auth/domain/entities/api-client.entity';
import { FindApiClientQuery } from '@src/modules/auth/queries/find-api-client/find-api-client.query';
import { BasicStrategy } from 'passport-http';
import { compareSync } from 'bcrypt';

@Injectable()
export class HttpStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private readonly queryBus: QueryBus) {
    super();
  }

  async validate(userId: string, password: string): Promise<ApiClientEntity> {
    const result: Result<ApiClientEntity, NotFoundException> =
      await this.queryBus.execute(
        new FindApiClientQuery({ clientId: new UUID(userId) }),
      );
    return result.unwrap(
      (u) => {
        const p = u.getPropsCopy();
        if (!compareSync(password, p.secret)) {
          throw new UnauthorizedException('Invalid secret');
        }
        return u;
      },
      (_) => {
        throw new UnauthorizedException('Client not found');
      },
    );
  }
}
