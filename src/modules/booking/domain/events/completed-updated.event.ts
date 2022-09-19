import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';

export class CompletedUpdatedEvent extends DomainEvent {
  readonly bookingID: string;
  constructor(props: DomainEventProps<CompletedUpdatedEvent>) {
    super(props);
    this.bookingID = props.bookingID;
  }
}
