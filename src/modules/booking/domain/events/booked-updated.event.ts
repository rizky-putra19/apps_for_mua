import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';

export class BookedUpdatedEvent extends DomainEvent {
  readonly bookingID: string;
  constructor(props: DomainEventProps<BookedUpdatedEvent>) {
    super(props);
    this.bookingID = props.bookingID;
  }
}
