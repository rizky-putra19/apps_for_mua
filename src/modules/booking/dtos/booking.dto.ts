import { CategoryTreeResponse } from '@src/modules/category/dtos/category.dto';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { Expose } from 'class-transformer';
import { BookingServiceEntity } from '../domain/entities/booking-service.entity';
import { BookingStatusEntity } from '../domain/entities/booking-status.entity';
import { BookingVenueEntity } from '../domain/entities/booking-venue.entity';
import { BookingEntity } from '../domain/entities/booking.entity';
import { BookingStatusHistoryEntity } from '../domain/entities/bookings-status-history.entity';
import moment from 'moment';

export class BookingResponse {
  id: string;
  name: string;
  @Expose({ name: 'event_name' })
  eventName: string;
  services?: BookingServiceResponse[];
  venue?: BookingVenueResponse;
  customer?: UserResponse;
  artisan?: UserResponse;
  @Expose({ name: 'event_date' })
  eventDate: string;
  status: BookingStatusEntity;
  histories: BookingStatusHistoryEntity[];
  @Expose({ name: 'grand_total' })
  grandTotal: number;

  constructor(entity: BookingEntity) {
    const props = entity.getPropsCopy();
    this.id = props.id.value;
    this.name = props.name;
    this.eventName = props.eventName;
    this.eventDate = moment(props.eventDate).format();
    this.status = props.status;
    this.artisan = new UserResponse(props.artisan);
    this.customer = new UserResponse(props.customer);
    this.services = props.services.map((s) => new BookingServiceResponse(s));
    this.venue = new BookingVenueResponse(props.venue);
    this.histories = props.histories;
    this.grandTotal = props.grandTotal;
  }
}

export class BookingVenueResponse {
  readonly venueName: string;
  readonly address: string;
  readonly notes: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly extra?: { [key: string]: any };
  readonly id: string;
  constructor(bookingVenueEntity: BookingVenueEntity) {
    const props = bookingVenueEntity.getPropsCopy();
    this.id = props.id.value;
    this.venueName = props.venueName;
    this.address = props.address;
    this.notes = props.notes;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.extra = props.extra;
  }
}

export class BookingServiceResponse {
  title: string;
  quantity: number;
  price: number;
  notes?: string;
  id: string;
  category: CategoryTreeResponse;
  constructor(bookingServicesEntity: BookingServiceEntity) {
    const props = bookingServicesEntity.getPropsCopy();
    this.id = props.id.value;
    this.title = props.title;
    this.quantity = props.quantity;
    this.price = props.price;
    this.notes = props.notes;
    this.category = new CategoryTreeResponse(
      props.service.getPropsCopy().category,
    );
  }
}

export class ProcessCodeResponse {
  code: string;
  constructor(entity: BookingEntity) {
    const props = entity.getPropsCopy();
    this.code = props.processCode;
  }
}
