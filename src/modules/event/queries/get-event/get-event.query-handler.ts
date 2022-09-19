import { Result } from '@badrap/result';
import { CommandHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';

import { NotFoundException } from '@src/libs/exceptions';
import { EventRepository } from '../../database/event.repository';
import { EventEntity } from '../../domain/entities/event.entity';
import { GetEventQuery } from './get-event.query';

@QueryHandler(GetEventQuery)
export class GetEventQueryHandler extends QueryHandlerBase {
  constructor(private readonly eventRepository: EventRepository) {
    super();
  }
  async handle(query: GetEventQuery): Promise<Result<EventEntity, Error>> {
    const result = await this.eventRepository.findOne({
      id: query.id,
    });

    if (!result) {
      throw new NotFoundException('event not found');
    }

    return Result.ok(result);
  }
}
