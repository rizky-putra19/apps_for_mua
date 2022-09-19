import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';

export class CancelByCustomerUpdatedEvent extends DomainEvent {
  readonly bookingID: string;
  constructor(props: DomainEventProps<CancelByCustomerUpdatedEvent>) {
    super(props);
    this.bookingID = props.bookingID;
  }
}
