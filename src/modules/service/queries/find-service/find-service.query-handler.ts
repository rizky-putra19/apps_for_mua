import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import {
  DataWithPaginationMeta,
  NON_SEARCH_FIELD_PARAM,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { FindConditions, In } from 'typeorm';
import { ServiceOrmEntity } from '../../database/service.orm-entity';
import { ServiceRepository } from '../../database/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceStatus } from '../../domain/enum/service-status.enum';
import { FindServiceQuery } from './find-service.query';

@QueryHandler(FindServiceQuery)
export class FindServiceQueryHandler extends QueryHandlerBase {
  constructor(private readonly serviceRepository: ServiceRepository) {
    super();
  }
  async handle(
    query: FindServiceQuery,
  ): Promise<Result<DataWithPaginationMeta<ServiceEntity[]>, Error>> {
    const { params } = query;
    const { order = 'createdAt:desc' } = params;
    const [field, direction] = order.split(':');
    let filters: FindConditions<ServiceOrmEntity> = {};
    Object.keys(params)
      .filter((s) => !NON_SEARCH_FIELD_PARAM.includes(s))
      .forEach((key) => {
        const val = params[key].split(',');
        filters = {
          [key]: In(val),
        };
      });

    if (params.artisan) {
      filters.artisan = {
        id: params.artisan,
      };
    }

    if (params.category) {
      filters.category = {
        id: params.category,
      };
    }
    filters.status = ServiceStatus.ACTIVE;

    const services = await this.serviceRepository.findManyPaginated({
      order: {
        [field]: direction.toUpperCase(),
      },
      where: filters,
    });

    return Result.ok(services);
  }
}
