import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ServiceRepository } from '../../database/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { GetServiceQuery } from './get-service.query';

@QueryHandler(GetServiceQuery)
export class GetServiceQueryHandler extends QueryHandlerBase {
  constructor(private readonly serviceRepository: ServiceRepository) {
    super();
  }
  async handle(query: GetServiceQuery): Promise<Result<ServiceEntity, Error>> {
    try {
      const service = await this.serviceRepository.findOneServiceById(
        query.serviceID,
      );

      return Result.ok(service);
    } catch (error) {
      return Result.err(error);
    }
  }
}
