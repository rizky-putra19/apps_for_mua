import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class InvoiceCreatedEvent extends DomainEvent {
  readonly invoiceId: ID;
  constructor(props: DomainEventProps<InvoiceCreatedEvent>) {
    super(props);
    this.invoiceId = props.invoiceId;
  }
}
