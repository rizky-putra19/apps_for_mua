import { Result } from '@badrap/result';

import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { DeviceEntity } from '../../domain/entities/device.entity';
import { CreateUpdateCommand } from './create-update.command';

@CommandHandler(CreateUpdateCommand)
export class CreateUpdateCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    command: CreateUpdateCommand,
  ): Promise<Result<DeviceEntity, Error>> {
    const deviceRepository = this.unitOfWork.getDeviceRepository(
      command.correlationId,
    );
    const { deviceId, pushToken, user, platform, type } = command;
    let device = await deviceRepository.findOne({ deviceId, type });
    if (!device) {
      device = DeviceEntity.create({
        deviceId,
        pushToken,
        user,
        platform,
        type,
      });
    } else {
      const deviceProps = device.getPropsCopy();
      device = DeviceEntity.update(device.id, {
        deviceId: deviceProps.deviceId,
        pushToken,
        user,
        platform: deviceProps.platform,
        type: deviceProps.type,
      });
    }

    await deviceRepository.save(device);

    return Result.ok(device);
  }
}
