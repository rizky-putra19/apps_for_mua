import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { DeviceEntity } from '../entities/device.entity';

export class DeviceUpdatedEvent extends DomainEvent {
  readonly device: DeviceEntity;
  constructor(private readonly props: DomainEventProps<DeviceUpdatedEvent>) {
    super(props);
    this.device = props.device;
  }
}
