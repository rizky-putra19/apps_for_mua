import { Result } from '@badrap/result';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../dtos/event.response.dto';
import { GetEventQuery } from './get-event.query';

@Controller({
  version: '1',
  path: '/events',
})
export class GetEventHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  async show(@Param('id') id: string) {
    const result: Result<EventEntity> = await this.queryBus.execute(
      new GetEventQuery(new UUID(id)),
    );

    return new DataResponseBase(result.unwrap((e) => new EventResponseDto(e)));
  }
}
