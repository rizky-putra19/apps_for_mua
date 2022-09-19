import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { NotFoundException } from '@src/libs/exceptions';
import { ApiClientRepository } from '../../database/api-client.repository';
import { ApiClientEntity } from '../../domain/entities/api-client.entity';
import { FindApiClientQuery } from './find-api-client.query';

@QueryHandler(FindApiClientQuery)
export class FindApiQueryHandler extends QueryHandlerBase {
  constructor(private readonly apiClientRepository: ApiClientRepository) {
    super();
  }
  async handle(
    query: FindApiClientQuery,
  ): Promise<Result<ApiClientEntity, NotFoundException>> {
    try {
      const result = await this.apiClientRepository.findOneByIdOrThrow(
        query.clientId,
      );
      return Result.ok(result);
    } catch (err) {
      return Result.err(err);
    }
  }
}
