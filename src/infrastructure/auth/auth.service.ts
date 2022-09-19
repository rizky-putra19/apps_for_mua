import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GetUserQuery } from '@src/modules/user/queries/get-user/get-user.query';

@Injectable()
export class AuthService {
  constructor(private readonly queryBus: QueryBus) {}

  async validateUser(subject: string): Promise<Result<UserEntity>> {
    const result: Result<UserEntity> = await this.queryBus.execute(
      new GetUserQuery({ userId: subject }),
    );
    return result;
  }
}
