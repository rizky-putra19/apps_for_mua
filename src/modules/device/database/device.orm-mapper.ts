import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { DeviceEntity, DeviceProps } from '../domain/entities/device.entity';
import { DeviceOrmEntity } from './device.orm-entity';

export class DeviceOrmMapper extends OrmMapper<DeviceEntity, DeviceOrmEntity> {
  protected toDomainProps(
    ormEntity: DeviceOrmEntity,
  ): EntityProps<DeviceProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        deviceId: ormEntity.deviceId,
        pushToken: ormEntity.pushToken,
        user: UserOrmMapper.convertToDomainEntity(ormEntity.user),
        platform: ormEntity.platform,
        type: ormEntity.type,
      },
    };
  }
  protected toOrmProps(entity: DeviceEntity): OrmEntityProps<DeviceOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      deviceId: props.deviceId,
      platform: props.platform,
      pushToken: props.pushToken,
      user: UserOrmMapper.convertToOrmEntity(props.user),
      type: props.type,
    };
  }
}
