import {
  CommandProps,
  Command,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingStatus } from '../../domain/enums/booking-status.enum';

export class UpdateBookingStatusCommand extends Command {
  readonly id: string;
  readonly bookingStatus: BookingStatus;
  readonly user?: UserEntity;
  readonly body?: { [key: string]: any };

  constructor(props: CommandProps<UpdateBookingStatusCommand>) {
    super(props);
    this.id = props.id;
    this.bookingStatus = props.bookingStatus;
    this.user = props.user;
    this.body = props.body;
  }
}
