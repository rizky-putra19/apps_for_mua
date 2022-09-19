import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UserMetadataRepository } from '@src/modules/user/database/user-metadata.repository';
import { UserMetadataEntity } from '@src/modules/user/domain/entities/user-metadata';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditMetadataCommand } from './edit-user-metadata.command';

@CommandHandler(EditMetadataCommand)
export class EditMetadataCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly userMetaRepo: UserMetadataRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: EditMetadataCommand,
  ): Promise<Result<UserEntity, Error>> {
    const { user, metadata } = command;
    try {
      const userRepo = this.unitOfWork.getUserRepository(command.correlationId);
      const metadataEntity = await this.userMetaRepo.findOneByNameAndUserId(
        metadata.name,
        user.id.value,
      );

      const updated = new UserMetadataEntity({
        ...metadataEntity,
        value: metadata.value,
      });
      await this.userMetaRepo.save(updated);

      const result = await userRepo.findById(user.id.value);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
