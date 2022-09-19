import { Result } from '@badrap/result';
import { CommandBus, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UpdatePasswordCommand } from '@src/modules/user/commands/update-password/update-password.command';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { ForgotPasswordCommand } from './forgot-password.command';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly commandBus: CommandBus,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: ForgotPasswordCommand,
  ): Promise<Result<UserEntity, Error>> {
    const userRepo = this.unitOfWork.getUserRepository(command.correlationId);
    const code = command.code;
    const [email, userType] = Buffer.from(code, 'base64')
      .toString('ascii')
      .split(':');
    const user = await userRepo.findOne({
      email: email,
      type: UserType[userType.toUpperCase()],
    });

    await this.commandBus.execute(
      new UpdatePasswordCommand({
        password: command.newPassword,
        userID: user.id.value,
      }),
    );
    return Result.ok(user);
  }
}
