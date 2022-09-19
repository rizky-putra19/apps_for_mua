import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { DeviceEntity } from '../entities/device.entity';

export class DeviceCreatedEvent extends DomainEvent {
  readonly device: DeviceEntity;
  constructor(private readonly props: DomainEventProps<DeviceCreatedEvent>) {
    super(props);
    this.device = props.device;
  }
}
