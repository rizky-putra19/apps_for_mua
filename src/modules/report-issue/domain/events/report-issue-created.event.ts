import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';

export class ReportIssueCreatedEvent extends DomainEvent {
  readonly bookingId: string;
  constructor(props: DomainEventProps<ReportIssueCreatedEvent>) {
    super(props);
    this.bookingId = props.bookingId;
  }
}
