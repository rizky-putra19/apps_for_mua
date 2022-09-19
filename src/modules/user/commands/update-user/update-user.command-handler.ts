import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { UserRepository } from '../../database/user.repository';
import { UserEntity, UserProps } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../errors/user.errors';
import { UpdateUserCommand } from './update-user.command';
import { hashSync, genSaltSync } from 'bcrypt';
import { UserStatus } from '../../domain/enums/user-status.enum';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateUserCommand,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    try {
      const salt = genSaltSync(12);
      const userRepo: UserRepository = this.unitOfWork.getUserRepository(
        command.correlationId,
      );
      const user = await (command.id != null
        ? userRepo.findOneOrThrow({ id: new UUID(command.id) })
        : userRepo.findOneOrThrow({ legacyId: command.legacyId }));

      const userData = user.getPropsCopy();

      const updateData: UserProps = {
        email: userData.email,
        name: command.name,
        password:
          command.password != null
            ? hashSync(command.password, salt)
            : userData.password,
        phoneNumber:
          command.phoneNumber != null
            ? command.phoneNumber
            : userData.phoneNumber,
        type: userData.type,
        status:
          UserStatus[command.status.toUpperCase()] != null
            ? command.status
            : UserStatus[userData.status.toUpperCase()],
        metadata: [],
      };

      const updated = await userRepo.save(
        new UserEntity({ id: user.id, props: updateData }),
      );

      return Result.ok(updated);
    } catch (err) {
      return Result.err(err);
    }
  }
}
