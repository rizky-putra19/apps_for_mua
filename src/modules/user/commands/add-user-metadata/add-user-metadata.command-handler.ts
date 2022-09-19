import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserMetadataEntity } from '@src/modules/user/domain/entities/user-metadata';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { AddMetadataCommand } from './add-user-metadata.command';

@CommandHandler(AddMetadataCommand)
export class AddMetadataCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }
  async handle(
    command: AddMetadataCommand,
  ): Promise<Result<UserEntity, Error>> {
    const { user, metadata } = command;
    try {
      const userRepo = this.unitOfWork.getUserRepository(command.correlationId);
      const userProps = (await userRepo.findById(user.id.value)).getPropsCopy();

      const userMeta = userProps.metadata;
      userMeta.push(
        new UserMetadataEntity({
          name: metadata.name,
          value: metadata.value,
          dataType: metadata.dataType,
        }),
      );

      const updated = new UserEntity({
        id: new UUID(user.id.value),
        props: {
          ...userProps,
          metadata: userMeta,
        },
      });

      const result = await userRepo.save(updated);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
