import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { NotFoundException } from '@src/libs/exceptions';
import { UserRepository } from '../../database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { GetUserLegacyQuery } from './get-user-legacy.query';

@QueryHandler(GetUserLegacyQuery)
export class GetUserLegacyQueryHandler extends QueryHandlerBase {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }
  async handle(query: GetUserLegacyQuery): Promise<Result<UserEntity, Error>> {
    const result = await this.userRepository.findOneOrThrow({
      legacyId: query.legacyId,
    });

    if (!result) {
      throw new NotFoundException('User not found');
    }
    return Result.ok(result);
  }
}
