import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { PaymentStatus } from '@src/modules/booking/domain/enums/payment-status.enum';
import { PaymentEntity } from '../entities/payment-entity';

export class PaymentUpdatedEvent extends DomainEvent {
  readonly invoiceCode: string;
  readonly payment: PaymentEntity;
  constructor(props: DomainEventProps<PaymentUpdatedEvent>) {
    super(props);
    this.payment = this.payment;
    this.invoiceCode = props.invoiceCode;
  }
}
