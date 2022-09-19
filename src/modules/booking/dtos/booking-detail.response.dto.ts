import { Expose } from 'class-transformer';
import { BookingEntity } from '../domain/entities/booking.entity';
import moment from 'moment';
import { ResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/response.base';
import { BookingResponse } from './booking.dto';

export class BookingDetailResponse extends ResponseBase {
  id: string;
  @Expose({ name: 'booking_code' })
  code: string;
  @Expose({ name: 'booking_created_date' })
  bookingCreatedDate: string | Date;
  @Expose({ name: 'booking_updated_date' })
  bookingUpdatedDate: string | Date;
  @Expose({ name: 'platform_fee' })
  platformFee: number;
  @Expose({ name: 'sub_total' })
  subTotal: number;
  @Expose({ name: 'grand_total' })
  total: number;
  booking: BookingResponse;

  constructor(booking: BookingEntity) {
    super(booking);
    const props = booking.getPropsCopy();
    this.id = props.id.value;
    this.code = props.code;
    this.bookingCreatedDate = moment(props.createdAt.value).format();
    this.bookingUpdatedDate = moment(props.updatedAt.value).format();
    this.booking = new BookingResponse(booking);
    this.platformFee = props.platformFee;
    this.subTotal = props.subTotal;
    this.total = props.grandTotal;
  }
}
