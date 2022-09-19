import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { ServiceOrmMapper } from '@src/modules/service/database/service-orm-mapper';
import { EventEntity, EventProps } from '../domain/entities/event.entity';
import { EventOrmEntity } from './event.orm-entity';

export class EventOrmMapper extends OrmMapper<EventEntity, EventOrmEntity> {
  protected toDomainProps(ormEntity: EventOrmEntity): EntityProps<EventProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        title: ormEntity.title,
        description: ormEntity.description,
        eventEndAt: ormEntity.eventEndAt,
        eventStartAt: ormEntity.eventStartAt,
        status: ormEntity.status,
        type: ormEntity.type,
        address: ormEntity.address,
        latitude: ormEntity.latitude,
        longitude: ormEntity.longitude,
        participants: ormEntity.participants.map((p) => {
          return UserOrmMapper.convertToDomainEntity(p);
        }),
        services: ormEntity.services.map((s) => {
          return ServiceOrmMapper.convertToDomainProps(s);
        }),
      },
    };
  }
  protected toOrmProps(entity: EventEntity): OrmEntityProps<EventOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      title: props.title,
      description: props.description,
      eventEndAt: props.eventEndAt,
      eventStartAt: props.eventStartAt,
      status: props.status,
      type: props.type,
      address: props.address,
      latitude: props.latitude,
      longitude: props.longitude,
      participants: props.participants.map((p) => {
        return UserOrmMapper.convertToOrmEntity(p);
      }),
      services: props.services.map((s) => {
        return ServiceOrmMapper.convertToOrmEntity(s);
      }),
    };
  }

  static convertToDomainProps(ormEntity: EventOrmEntity) {
    const mapper = new EventOrmMapper(EventEntity, EventOrmEntity);
    return mapper.toDomainEntity(ormEntity);
  }

  static convertToOrmEntity(serviceEntity: EventEntity): EventOrmEntity {
    const mapper = new EventOrmMapper(EventEntity, EventOrmEntity);
    return mapper.toOrmEntity(serviceEntity);
  }
}
