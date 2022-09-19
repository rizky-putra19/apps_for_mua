import { Result } from '@badrap/result';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { EventEntity } from '../../domain/entities/event.entity';
import { CreateEventCommand } from './create-event.command';
import { CreateEventRequest } from './create-event.request';

@Controller({
  version: '1',
  path: '/events',
})
export class CreateEventHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async create(@Body() request: CreateEventRequest) {
    const result: Result<EventEntity> = await this.commandBus.execute(
      new CreateEventCommand({
        ...request,
        eventEndAt: new DateVO(request.eventEndAt),
        eventStartAt: new DateVO(request.eventStartAt),
      }),
    );

    return new DataResponseBase(
      result.unwrap((e) => new IdResponse(e.id.value)),
    );
  }
}
