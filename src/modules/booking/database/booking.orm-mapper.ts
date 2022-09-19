import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { InvoiceOrmMapper } from '@src/modules/invoice/database/invoice.orm-mapper';
import { ServiceOrmMapper } from '@src/modules/service/database/service-orm-mapper';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { BookingServiceEntity } from '../domain/entities/booking-service.entity';
import { BookingStatusEntity } from '../domain/entities/booking-status.entity';
import { BookingVenueEntity } from '../domain/entities/booking-venue.entity';
import { BookingEntity, BookingProps } from '../domain/entities/booking.entity';
import { BookingStatusHistoryEntity } from '../domain/entities/bookings-status-history.entity';
import { BookingServiceOrmEntity } from './booking-service.orm-entity';
import { BookingStatusHistoryOrmEntity } from './booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from './booking-status.orm-entity';
import { BookingVenueOrmEntity } from './booking-venue.orm-entity';
import { BookingOrmEntity } from './booking.orm-entity';

export class BookingOrmMapper extends OrmMapper<
  BookingEntity,
  BookingOrmEntity
> {
  protected toDomainProps(
    ormEntity: BookingOrmEntity,
  ): EntityProps<BookingProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        venue: BookingVenueEntity.convertToDomainEntity(ormEntity.venue),
        artisan: UserOrmMapper.convertToDomainEntity(ormEntity.artisan),
        code: ormEntity.code,
        customer: UserOrmMapper.convertToDomainEntity(ormEntity.customer),
        eventDate: ormEntity.eventDate,
        eventName: ormEntity.eventName,
        name: ormEntity.name,
        status: BookingStatusEntity.convertToDomainEntity(ormEntity.status),
        services: ormEntity.services?.map((s) => {
          return BookingServiceEntity.convertToDomainEntity(s);
        }),
        histories: ormEntity.histories?.map((h) =>
          BookingStatusHistoryEntity.convertToDomainEntity(h),
        ),
        platformFee: ormEntity.platformFee,
        subTotal: ormEntity.subTotal,
        grandTotal: ormEntity.grandTotal,
        processCode: ormEntity.processCode,
        invoice: InvoiceOrmMapper.convertToDomainEntity(ormEntity.invoice),
      },
    };
  }
  protected toOrmProps(
    entity: BookingEntity,
  ): OrmEntityProps<BookingOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      eventDate: props.eventDate,
      eventName: props.eventName,
      name: props.name,
      status: this.convertStatusToOrmEntity(props.status),
      artisan: UserOrmMapper.convertToOrmEntity(props.artisan),
      customer: UserOrmMapper.convertToOrmEntity(props.customer),
      code: props.code,
      platformFee: props.platformFee,
      subTotal: props.subTotal,
      grandTotal: props.grandTotal,
      processCode: props.processCode,
      invoice: InvoiceOrmMapper.convertToOrmEntity(props.invoice),
      services: props.services?.map((s) => {
        const sProps = s.getPropsCopy();
        const bookingServiceOrm = new BookingServiceOrmEntity();
        bookingServiceOrm.id = sProps.id.value;
        bookingServiceOrm.title = sProps.title;
        bookingServiceOrm.notes = sProps.notes;
        bookingServiceOrm.price = sProps.price;
        bookingServiceOrm.quantity = sProps.quantity;
        bookingServiceOrm.total = sProps.total;
        bookingServiceOrm.service = ServiceOrmMapper.convertToOrmEntity(
          sProps.service,
        );
        return bookingServiceOrm;
      }),
      venue: this.convertVenueToOrmEntity(props.venue),
      histories: props.histories?.map((h) =>
        this.convertStatusHistoryToOrmEntity(h),
      ),
    };
  }

  static convertToOrmEntity(entity: BookingEntity) {
    const mapper = new BookingOrmMapper(BookingEntity, BookingOrmEntity);
    return mapper.toOrmEntity(entity);
  }

  private convertVenueToOrmEntity(
    entity: BookingVenueEntity,
  ): BookingVenueOrmEntity {
    if (entity) {
      const ormEntity = new BookingVenueOrmEntity();
      const venueEntity = entity.getPropsCopy();
      ormEntity.id = venueEntity.id.value;
      ormEntity.address = venueEntity.address;
      ormEntity.extra = venueEntity.extra;
      ormEntity.latitude = venueEntity.latitude;
      ormEntity.venueName = venueEntity.venueName;
      ormEntity.notes = venueEntity.notes;
      ormEntity.longitude = venueEntity.longitude;
      return ormEntity;
    }
  }

  static toDomainEntity(entity: BookingOrmEntity): BookingEntity {
    if (entity != undefined) {
      const mapper = new BookingOrmMapper(BookingEntity, BookingOrmEntity);
      return mapper.toDomainEntity(entity);
    }
  }

  static toOrmEntity(entity: BookingEntity): BookingOrmEntity {
    const mapper = new BookingOrmMapper(BookingEntity, BookingOrmEntity);
    return mapper.toOrmEntity(entity);
  }

  private convertStatusToOrmEntity(entity: BookingStatusEntity) {
    if (entity) {
      const ormEntity = new BookingStatusOrmEntity();
      ormEntity.description = entity.description;
      ormEntity.id = entity.id;
      ormEntity.title = entity.title;
      return ormEntity;
    }
  }

  private convertStatusHistoryToOrmEntity(entity: BookingStatusHistoryEntity) {
    const ormEntity = new BookingStatusHistoryOrmEntity();
    ormEntity.notes = entity.notes;
    ormEntity.status = this.convertStatusToOrmEntity(entity.status);
    return ormEntity;
  }
}
