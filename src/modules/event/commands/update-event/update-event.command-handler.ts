import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';

import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { EventEntity } from '../../domain/entities/event.entity';
import { UpdateEventCommand } from './update-event.command';

@CommandHandler(UpdateEventCommand)
export class UpdateEventCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    command: UpdateEventCommand,
  ): Promise<Result<EventEntity, Error>> {
    const eventRepo = this.unitOfWork.getEventRepository(command.correlationId);
    const { eventId, request } = command;
    const event = await eventRepo.findOne({ id: eventId });
    const entity = EventEntity.update(request, event);

    const res = await eventRepo.save(entity);
    return Result.ok(res);
  }
}
