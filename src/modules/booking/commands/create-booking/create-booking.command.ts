import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import {
  CreateBookingServiceRequest,
  CreateBookingVenueRequest,
} from './create-booking.request';

export class CreateBookingCommand extends Command {
  readonly customer: UserEntity;
  readonly eventDate: string;
  readonly services: CreateBookingServiceRequest[];
  readonly venue: CreateBookingVenueRequest;
  readonly eventName: string;
  readonly name: string;
  constructor(props: CommandProps<CreateBookingCommand>) {
    super(props);
    this.name = props.name;
    this.customer = props.customer;
    this.eventDate = props.eventDate;
    this.services = props.services;
    this.venue = props.venue;
    this.eventName = props.eventName;
  }
}
