import { Result } from '../utils/result.util';
import { UnitOfWorkPort } from '../ports/unit-of-work.port';
import { Command } from './command-base';

export abstract class CommandHandlerBase<
  CommandHandlerReturnType = unknown,
  CommandHandlerError extends Error = Error,
> {
  constructor(protected readonly unitOfWork: UnitOfWorkPort) {}
  abstract handle(
    command: Command,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError>>;

  execute(command: Command) {
    if (this.unitOfWork) {
      return this.unitOfWork.execute(command.correlationId, async () =>
        this.handle(command),
      );
    } else {
      return this.handle(command);
    }
  }
}
