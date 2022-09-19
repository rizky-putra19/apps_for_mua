import { InvoiceEntity } from '@src/modules/invoice/domain/entities/invoice.entity';
import { PaymentEntity } from '@src/modules/payment/domain/entities/payment-entity';

export interface PaymentProvider {
  handle(body: any, header: any, correlationId: string): Promise<InvoiceEntity>;
}
