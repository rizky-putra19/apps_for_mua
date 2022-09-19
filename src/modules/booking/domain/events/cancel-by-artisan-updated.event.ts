import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';

export class CancelByArtisanUpdatedEvent extends DomainEvent {
  readonly bookingID: string;
  constructor(props: DomainEventProps<CancelByArtisanUpdatedEvent>) {
    super(props);
    this.bookingID = props.bookingID;
  }
}
