import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { ReasonRepository } from '../../database/reason.repository';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { CreateReasonCommand } from './create-reason.command';

@CommandHandler(CreateReasonCommand)
export class CreateReasonCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly reasonRepository: ReasonRepository,
  ) {
    super(unitOfWork);
  }
  async handle(command: CreateReasonCommand): Promise<Result<ReasonEntity>> {
    const reason = ReasonEntity.create({
      reason: command.reason,
      description: command.description,
      type: command.type,
    });

    const result = await this.reasonRepository.save(reason);

    return Result.ok(result);
  }
}
