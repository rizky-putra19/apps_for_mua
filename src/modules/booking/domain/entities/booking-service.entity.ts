import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { ServiceOrmMapper } from '@src/modules/service/database/service-orm-mapper';
import { ServiceEntity } from '@src/modules/service/domain/entities/service.entity';
import { BookingServiceOrmEntity } from '../../database/booking-service.orm-entity';

export interface CreateBookingServiceProps {
  title: string;
  quantity: number;
  price: number;
  service?: ServiceEntity;
  notes?: string;
  total: number;
}

export interface BookingServiceProps extends CreateBookingServiceProps {
  price: number;
}

export class BookingServiceEntity extends AggregateRoot<BookingServiceProps> {
  protected _id: ID;

  static create(props: CreateBookingServiceProps): BookingServiceEntity {
    const id = UUID.generate();

    return new BookingServiceEntity({
      id,
      props: {
        title: props.title,
        quantity: props.quantity,
        service: props.service,
        price: props.price,
        total: props.price * props.quantity,
        notes: props.notes,
      },
    });
  }

  static convertToDomainEntity(
    entity: BookingServiceOrmEntity,
  ): BookingServiceEntity {
    return new BookingServiceEntity({
      id: new UUID(entity.id),
      props: {
        title: entity.title,
        price: entity.price,
        quantity: entity.quantity,
        total: entity.total,
        notes: entity.notes,
        service: ServiceOrmMapper.convertToDomainProps(entity.service),
      },
    });
  }
}
