import { Injectable, Logger } from '@nestjs/common';
import { OneSignalClient } from '@src/infrastructure/http/onesignal.client';
import {
  DomainEvent,
  DomainEventHandler,
} from '@src/libs/ddd/domain/domain-events';
import { DeviceCreatedEvent } from '../../domain/events/device-created.event';

@Injectable()
export class RegisterToOneSignalListeners extends DomainEventHandler {
  private logger: Logger;
  constructor(private readonly oneSignalClient: OneSignalClient) {
    super(DeviceCreatedEvent);
    this.logger = new Logger('RegisterToOneSignalListeners');
  }
  async handle(event: DeviceCreatedEvent): Promise<void> {
    const { device } = event;
    const props = device.getPropsCopy();
    await this.oneSignalClient.createOrUpdateDevice(device);
  }
}
