import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { UserAddressRepository } from '@src/modules/user/database/user-address.repository';
import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';
import { EditAddressCommand } from './edit-address.command';

@CommandHandler(EditAddressCommand)
export class EditAddressCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly userAddressRepository: UserAddressRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: EditAddressCommand,
  ): Promise<Result<UserAddressEntity, Error>> {
    try {
      const { id, user, address } = command;
      const addressEntity = await this.userAddressRepository.findOneById(id);
      if (addressEntity.user.id.value != user.id.value) {
        throw new BadRequestException();
      }

      const userAddressEntity = new UserAddressEntity({
        id: addressEntity.id,
        user,
        name: address.name != null ? address.name : addressEntity.name,
        address:
          address.address != null ? address.address : addressEntity.address,
        notes: address.notes != null ? address.notes : addressEntity.notes,
        latitude:
          address.latitude != null ? address.latitude : addressEntity.latitude,
        longitude:
          address.longitude != null
            ? address.longitude
            : addressEntity.longitude,
      });

      const updated = await this.userAddressRepository.save(userAddressEntity);
      const result = UserAddressEntity.convertToDomainEntity(updated);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
