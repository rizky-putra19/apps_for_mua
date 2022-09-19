import { Result } from '@badrap/result';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../dtos/event.response.dto';
import { UpdateEventCommand } from './update-event.command';
import { UpdateEventRequest } from './update-event.request';

@Controller({
  version: '1',
  path: '/events',
})
export class UpdateEventHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch('/:eventId')
  async create(
    @Param('eventId') eventId: string,
    @Body() request: UpdateEventRequest,
  ) {
    const result: Result<EventEntity> = await this.commandBus.execute(
      new UpdateEventCommand({
        eventId: new UUID(eventId),
        request,
      }),
    );

    return new DataResponseBase(result.unwrap((e) => new EventResponseDto(e)));
  }
}
