import { Result } from '@badrap/result';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { EventEntity } from '../../domain/entities/event.entity';
import { EventResponseDto } from '../../dtos/event.response.dto';
import { DeleteEventCommand } from './delete-event.command';

@Controller({
  version: '1',
  path: '/events',
})
export class DeleteEventHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Delete('/:eventId')
  async create(@Param('eventId') eventId: string) {
    const result: Result<ID> = await this.commandBus.execute(
      new DeleteEventCommand({
        eventId: new UUID(eventId),
      }),
    );

    return new DataResponseBase(result.unwrap((e) => new IdResponse(e.value)));
  }
}
