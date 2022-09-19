import { Result } from '@badrap/result';
import { CommandHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';

import { NotFoundException } from '@src/libs/exceptions';
import { EventRepository } from '../../database/event.repository';
import { EventEntity } from '../../domain/entities/event.entity';
import { FindEventQuery } from './find-event.query';

@QueryHandler(FindEventQuery)
export class FindEventQueryHandler extends QueryHandlerBase {
  constructor(private readonly eventRepository: EventRepository) {
    super();
  }
  async handle(
    query: FindEventQuery,
  ): Promise<Result<DataWithPaginationMeta<EventEntity[]>, Error>> {
    const {
      findEventQueryParams: { order, orderBy, limit, page },
    } = query;
    const result: DataWithPaginationMeta<EventEntity[]> =
      await this.eventRepository.findManyPaginated({
        order: { [orderBy]: order },
        pagination: { limit: +limit, page: +page },
      });

    if (!result) {
      throw new NotFoundException('event not found');
    }

    return Result.ok(result);
  }
}
