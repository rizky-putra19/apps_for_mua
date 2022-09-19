import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateBookingServiceRequest {
  @IsNotEmpty()
  @Expose({ name: 'service_id' })
  serviceId: string;
  quantity: number;
  notes?: string;
}

export class CreateBookingVenueRequest {
  @Expose({ name: 'venue_name' })
  venueName: string;
  address: string;
  notes?: string;
  latitude: number;
  longitude: number;
  extra?: { [key: string]: any };
}

export class CreateBookingRequest {
  @IsNotEmpty()
  @Expose({ name: 'event_name' })
  readonly eventName: string;
  @IsNotEmpty()
  @Expose({ name: 'event_date' })
  readonly eventDate: string;
  @IsNotEmpty()
  readonly name: string;
  @IsArray()
  readonly services: CreateBookingServiceRequest[];
  readonly venue: CreateBookingVenueRequest;
}
