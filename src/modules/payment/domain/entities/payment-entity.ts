import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { PaymentStatus } from '../enum/payment-status.enum';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';

export interface CreatePaymentProps {
  total: number;
  url: string;
  payload: { [key: string]: any };
  providerId?: string;
}
export interface PaymentProps extends CreatePaymentProps {
  id?: ID;
  status: PaymentStatus;
  callback?: { [key: string]: any };
  paymentMethod?: string;
  bankCode?: string;
  paymentChannel?: string;
}

export class PaymentEntity extends AggregateRoot<PaymentProps> {
  protected _id: ID;
  static create(request: CreatePaymentProps): PaymentEntity {
    const paymentEntity = new PaymentEntity({
      id: UUID.generate(),
      props: {
        status: PaymentStatus.WAITING_FOR_PAYMENT,
        total: request.total,
        url: request.url,
        payload: request.payload,
        providerId: request.providerId,
      },
    });

    return paymentEntity;
  }

  static update(invoiceCode: string, props: PaymentProps) {
    const paymentEntity = new PaymentEntity({
      id: props.id,
      props,
    });

    paymentEntity.addEvent(
      new PaymentUpdatedEvent({
        invoiceCode,
        payment: paymentEntity,
        aggregateId: paymentEntity.props.id.value,
      }),
    );

    return paymentEntity;
  }
}
