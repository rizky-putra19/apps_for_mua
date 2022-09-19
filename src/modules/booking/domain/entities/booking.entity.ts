import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { DomainEvent } from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { InvoiceEntity } from '@src/modules/invoice/domain/entities/invoice.entity';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingStatus } from '../enums/booking-status.enum';
import { BookingCreatedEvent } from '../events/booking-created.event';
import { BookingUpdatedEvent } from '../events/booking-updated.event';
import { BookingServiceEntity } from './booking-service.entity';
import { BookingStatusEntity } from './booking-status.entity';
import { BookingVenueEntity } from './booking-venue.entity';
import { BookingStatusHistoryEntity } from './bookings-status-history.entity';

export interface CreateBookingProps {
  name: string;
  eventName: string;
  services?: BookingServiceEntity[];
  venue?: BookingVenueEntity;
  customer?: UserEntity;
  artisan?: UserEntity;
  eventDate: Date;
  platformFee?: number;
  subTotal: number;
  grandTotal: number;
  status: BookingStatusEntity;
  histories: BookingStatusHistoryEntity[];
  processCode: string;
}

export interface BookingProps extends CreateBookingProps {
  code: string;
  status: BookingStatusEntity;
  histories: BookingStatusHistoryEntity[];
  id?: ID;
  invoice?: InvoiceEntity;
}

export class BookingEntity extends AggregateRoot<BookingProps> {
  protected _id: ID;

  static create(request: CreateBookingProps): BookingEntity {
    const bookingId = UUID.generate();
    const bookingEntity = new BookingEntity({
      id: bookingId,
      props: {
        artisan: request.artisan,
        customer: request.customer,
        services: request.services,
        eventDate: request.eventDate,
        eventName: request.eventName,
        name: request.name,
        venue: request.venue,
        code: `BEB-${bookingId.value.split('-')[0]}`,
        processCode: request.processCode,
        status: request.status,
        platformFee: request.platformFee,
        subTotal: request.subTotal,
        grandTotal: request.grandTotal,
        histories: request.histories,
      },
    });
    bookingEntity.addEvent(
      new BookingCreatedEvent({
        id: bookingId,
        aggregateId: bookingId.value,
      }),
    );

    return bookingEntity;
  }

  static update(
    request: BookingProps,
    events: DomainEvent[] = [],
  ): BookingEntity {
    const bookingEntityUpdate = new BookingEntity({
      id: request.id,
      props: {
        status: request.status,
        eventDate: request.eventDate,
        eventName: request.eventName,
        name: request.name,
        code: request.code,
        processCode: request.processCode,
        artisan: request.artisan,
        customer: request.customer,
        services: request.services,
        venue: request.venue,
        platformFee: request.platformFee,
        subTotal: request.subTotal,
        grandTotal: request.grandTotal,
        histories: request.histories,
        invoice: request.invoice,
      },
    });
    events.forEach((e) => bookingEntityUpdate.addEvent(e));

    bookingEntityUpdate.addEvent(
      new BookingUpdatedEvent({
        id: bookingEntityUpdate.id,
        aggregateId: bookingEntityUpdate.id.value,
      }),
    );

    return bookingEntityUpdate;
  }
}
