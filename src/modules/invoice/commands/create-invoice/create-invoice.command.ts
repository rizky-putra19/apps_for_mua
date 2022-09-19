import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';

export class CreateInvoiceCommand extends Command {
  readonly booking: BookingEntity;
  constructor(props: CommandProps<CreateInvoiceCommand>) {
    super(props);
    this.booking = props.booking;
  }
}
