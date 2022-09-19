import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { PaymentEntity } from '@src/modules/payment/domain/entities/payment-entity';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { InvoiceOrmEntity } from '../../database/invoice.orm-entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceCreatedEvent } from '../events/invoice-created.event';

export interface CreateInvoiceProps {
  booking: BookingEntity;
  subtotal: number;
  code: string;
  grandTotal: number;
  customer: UserEntity;
  artisan: UserEntity;
  payment?: PaymentEntity;
}

export interface InvoiceProps extends CreateInvoiceProps {
  id?: number;
  status: InvoiceStatus;
}

export class InvoiceEntity extends AggregateRoot<InvoiceProps> {
  protected _id: ID;

  static create(props: CreateInvoiceProps): InvoiceEntity {
    const invoice = new InvoiceEntity({
      id: UUID.generate(),
      props: {
        code: props.code,
        booking: props.booking,
        subtotal: props.subtotal,
        grandTotal: props.grandTotal,
        status: InvoiceStatus.UNPAID,
        customer: props.customer,
        artisan: props.artisan,
        payment: props.payment,
      },
    });
    invoice.addEvent(
      new InvoiceCreatedEvent({
        aggregateId: invoice.id.value,
        invoiceId: invoice.id,
      }),
    );
    return invoice;
  }
}
