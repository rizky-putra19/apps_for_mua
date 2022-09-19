import { Injectable, Logger } from '@nestjs/common';
import {
  DomainEvent,
  DomainEventHandler,
} from '@src/libs/ddd/domain/domain-events';

import { DeviceUpdatedEvent } from '../../domain/events/device-update.event';
import * as OneSignal from '@onesignal/node-onesignal';
import { OneSignalClient } from '@src/infrastructure/http/onesignal.client';
@Injectable()
export class UpdateOneSignalListeners extends DomainEventHandler {
  private logger: Logger;
  constructor(private readonly oneSignalClient: OneSignalClient) {
    super(DeviceUpdatedEvent);
    this.logger = new Logger('UpdateOneSignalListeners');
  }
  async handle(event: DeviceUpdatedEvent): Promise<void> {
    const { device } = event;
    const props = device.getPropsCopy();
    await this.oneSignalClient.createOrUpdateDevice(device);
  }
}
