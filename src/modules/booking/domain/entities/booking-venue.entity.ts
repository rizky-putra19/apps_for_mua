import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingVenueOrmEntity } from '../../database/booking-venue.orm-entity';

export interface CreateBookingVenueProps {
  readonly venueName: string;
  readonly address: string;
  readonly notes: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly extra?: { [key: string]: any };
}
export interface BookingVenueProps extends CreateBookingVenueProps {}
export class BookingVenueEntity extends AggregateRoot<BookingVenueProps> {
  protected _id: ID;

  static create(request: CreateBookingVenueProps): BookingVenueEntity {
    const id = UUID.generate();

    return new BookingVenueEntity({
      id,
      props: {
        venueName: request.venueName,
        address: request.address,
        notes: request.notes,
        latitude: request.latitude,
        longitude: request.longitude,
        extra: request.extra,
      },
    });
  }

  static convertToDomainEntity(
    venueOrmEntity: BookingVenueOrmEntity,
  ): BookingVenueEntity {
    if (venueOrmEntity != undefined) {
      return new BookingVenueEntity({
        id: new UUID(venueOrmEntity.id),
        props: {
          address: venueOrmEntity.address,
          latitude: venueOrmEntity.latitude,
          longitude: venueOrmEntity.longitude,
          notes: venueOrmEntity.notes,
          venueName: venueOrmEntity.venueName,
          extra: venueOrmEntity.extra,
        },
      });
    }
  }
}
