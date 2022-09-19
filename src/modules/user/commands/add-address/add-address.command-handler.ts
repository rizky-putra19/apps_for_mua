import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { Result } from '@badrap/result';
import { AddAddressCommand } from './add-address.command';
import { UserAddressRepository } from '@src/modules/user/database/user-address.repository';
import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';

@CommandHandler(AddAddressCommand)
export class AddAddressCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly userAddressRepository: UserAddressRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: AddAddressCommand,
  ): Promise<Result<UserAddressEntity, Error>> {
    try {
      const { user, address } = command;

      const userAddressEntity = UserAddressEntity.create({
        name: address.name,
        address: address.address,
        notes: address.notes,
        latitude: address.latitude,
        longitude: address.longitude,
        extra: address.extra,
        user: user,
      });

      const created = await this.userAddressRepository.save(userAddressEntity);
      const result = UserAddressEntity.convertToDomainEntity(created);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
