import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OneSignalClient } from '@src/infrastructure/http/onesignal.client';
import { DeviceOrmEntity } from '@src/modules/device/database/device.orm-entity';
import { CreateUpdateCommandHandler } from './commands/create-update/create-update.command-handler';
import { CreateUpdateHttpController } from './commands/create-update/create-update.http-controller';
import { DeviceRepository } from './database/device.repository';
import {
  registerToOneSignalEventHandler,
  updateOneSignalEventHandler,
} from './device.provider';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceOrmEntity]), CqrsModule],
  controllers: [CreateUpdateHttpController],
  providers: [
    DeviceRepository,
    CreateUpdateCommandHandler,
    registerToOneSignalEventHandler,
    updateOneSignalEventHandler,
    OneSignalClient,
  ],
  exports: [OneSignalClient],
})
export class DeviceModule {}
