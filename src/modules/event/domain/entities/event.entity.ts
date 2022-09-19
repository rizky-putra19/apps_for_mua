import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { ServiceEntity } from '@src/modules/service/domain/entities/service.entity';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UpdateEventRequest } from '../../commands/update-event/update-event.request';

export interface CreateEventProps {
  type: string;
  status: string;
  eventStartAt: Date;
  eventEndAt: Date;
  title: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}
export interface EventProps extends CreateEventProps {
  services: ServiceEntity[];
  participants: UserEntity[];
}
export class EventEntity extends AggregateRoot<EventProps> {
  protected _id: ID;

  public static create(create: CreateEventProps) {
    const id = UUID.generate();
    const entity = new EventEntity({
      id,
      props: {
        description: create.description,
        eventEndAt: create.eventEndAt,
        eventStartAt: create.eventStartAt,
        type: create.type,
        status: create.status,
        participants: [],
        services: [],
        title: create.title,
        address: create.address,
        latitude: create.latitude,
        longitude: create.longitude,
      },
    });

    return entity;
  }

  public static update(updatedValue: UpdateEventRequest, prev: EventEntity) {
    const prevProps = prev.getPropsCopy();
    const entity = new EventEntity({
      id: prevProps.id,
      props: {
        description: updatedValue.description || prevProps.description,
        eventEndAt:
          updatedValue.eventEndAt != null
            ? new DateVO(updatedValue.eventEndAt).value
            : prevProps.eventEndAt,
        eventStartAt:
          updatedValue.eventStartAt != null
            ? new DateVO(updatedValue.eventStartAt).value
            : prevProps.eventEndAt,
        type: updatedValue.type || prevProps.type,
        status: updatedValue.status || prevProps.status,
        participants: prevProps.participants,
        services: prevProps.services,
        title: updatedValue.title || prevProps.title,
        address: updatedValue.address || prevProps.address,
        latitude: updatedValue.latitude || prevProps.latitude,
        longitude: updatedValue.longitude || prevProps.longitude,
      },
    });

    return entity;
  }
}
