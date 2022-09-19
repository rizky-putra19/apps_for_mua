import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { DeviceCreatedEvent } from '../events/device-created.event';
import { DeviceUpdatedEvent } from '../events/device-update.event';

export interface CreateDeviceProps {
  deviceId: string;
  pushToken: string;
  user?: UserEntity;
  platform: string;
  type: UserType;
}

export interface DeviceProps extends CreateDeviceProps {}

export class DeviceEntity extends AggregateRoot<DeviceProps> {
  protected _id: ID;

  static create(props: CreateDeviceProps) {
    const id = UUID.generate();
    const entity = new DeviceEntity({
      id,
      props: {
        deviceId: props.deviceId,
        pushToken: props.pushToken,
        user: props.user,
        type: props.type,
        platform: props.platform,
      },
    });

    entity.addEvent(
      new DeviceCreatedEvent({
        device: entity,
        aggregateId: id.value,
      }),
    );
    return entity;
  }

  static update(id: ID, props: DeviceProps) {
    const entity = new DeviceEntity({
      id,
      props: {
        deviceId: props.deviceId,
        pushToken: props.pushToken,
        user: props.user,
        platform: props.platform,
        type: props.type,
      },
    });

    entity.addEvent(
      new DeviceUpdatedEvent({
        device: entity,
        aggregateId: id.value,
      }),
    );
    return entity;
  }
}
