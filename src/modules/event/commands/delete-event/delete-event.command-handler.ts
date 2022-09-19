import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';

import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { EventEntity } from '../../domain/entities/event.entity';
import { DeleteEventCommand } from './delete-event.command';

@CommandHandler(DeleteEventCommand)
export class DeleteEventCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(command: DeleteEventCommand): Promise<Result<ID, Error>> {
    const eventRepo = this.unitOfWork.getEventRepository(command.correlationId);
    const { eventId } = command;
    const event = await eventRepo.findOne({ id: eventId });

    const res = await eventRepo.softDelete(eventId);
    return Result.ok(eventId);
  }
}
