import { BookingStatus } from '../../domain/enums/booking-status.enum';

export class FindBookingQueryParams {
  search?: string;
  statuses?: BookingStatus[];
  categories?: number[];
  services?: number[];
  createdDate?: boolean;
  eventDate?: boolean;
  startDate?: Date;
  toDate?: Date;
  orderBy?: string;
  order?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}
