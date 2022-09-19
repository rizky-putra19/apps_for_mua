import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { MediaEntity } from '@src/modules/media/domain/entities/media.entity';
import { MediaType } from '@src/modules/media/domain/enums/media-type.enum';
import { GetMediaQuery } from '@src/modules/media/queries/get-media/get-media.query';
import { CacheService } from '@src/libs/ddd/infrastructure/cache/cache.service';
import { UserRepository } from '../../database/user.repository';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../errors/user.errors';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cacheService: CacheService,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  async handle(
    query: GetUserQuery,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    const user = await this.userRepo.findById(query.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Result.ok(user);
  }
}
