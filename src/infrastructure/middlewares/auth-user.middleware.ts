import { Result } from '@badrap/result';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { GetUserQuery } from '@src/modules/user/queries/get-user/get-user.query';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  constructor(private readonly queryBus: QueryBus) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const query = new GetUserQuery({
      userId: request.headers['x-subject'].toString(),
    });

    const result: Result<UserEntity> = await this.queryBus.execute(query);
    request.user = result.unwrap((u) => u);

    next();
  }
}
