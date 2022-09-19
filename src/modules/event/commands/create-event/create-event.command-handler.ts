import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';

import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { EventEntity } from '../../domain/entities/event.entity';
import { CreateEventCommand } from './create-event.command';

@CommandHandler(CreateEventCommand)
export class CreateEventCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    command: CreateEventCommand,
  ): Promise<Result<EventEntity, Error>> {
    const eventRepo = this.unitOfWork.getEventRepository(command.correlationId);
    const {
      title,
      type,
      description,
      eventStartAt,
      eventEndAt,
      status,
      address,
      latitude,
      longitude,
    } = command;
    const entity = EventEntity.create({
      description,
      eventStartAt: eventStartAt.value,
      eventEndAt: eventEndAt.value,
      status: status || 'draft',
      title,
      type,
      address,
      latitude,
      longitude,
    });
    console.log(
      '🚀 ~ file: create-event.command-handler.ts ~ line 28 ~ CreateEventCommandHandler ~ entity',
      entity,
    );
    const res = await eventRepo.save(entity);
    return Result.ok(res);
  }
}
