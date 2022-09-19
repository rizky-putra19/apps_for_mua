import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class BookingCreatedEvent extends DomainEvent {
  readonly id: ID;
  constructor(props: DomainEventProps<BookingCreatedEvent>) {
    super(props);
    this.id = props.id;
  }
}
