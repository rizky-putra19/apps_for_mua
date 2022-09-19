import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BookingProps } from '@src/modules/booking/domain/entities/booking.entity';
import { PaymentEntity } from '@src/modules/payment/domain/entities/payment-entity';
import { PaymentStatus } from '@src/modules/payment/domain/enum/payment-status.enum';
import Xendit from 'xendit-node';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { CreateInvoiceCommand } from './create-invoice.command';

@CommandHandler(CreateInvoiceCommand)
export class CreateInvoiceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly xendit: Xendit,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateInvoiceCommand,
  ): Promise<Result<InvoiceEntity, Error>> {
    const { booking, correlationId } = command;

    const bookingProps = booking.getPropsCopy();
    const invoiceRepo = this.unitOfWork.getInvoiceRepository(correlationId);
    const code = await invoiceRepo.generateCode(booking.id.value);
    const x: any = await this.generateXenditInvoice(bookingProps, code);

    const invoiceEntity = InvoiceEntity.create({
      artisan: bookingProps.artisan,
      booking: booking,
      customer: bookingProps.customer,
      grandTotal: bookingProps.grandTotal,
      code,
      subtotal: bookingProps.subTotal,
      payment: PaymentEntity.create({
        providerId: x.id,
        total: bookingProps.grandTotal,
        url: x.invoice_url,
        payload: x,
      }),
    });

    const result = await invoiceRepo.save(invoiceEntity);
    return Result.ok(invoiceEntity);
  }

  private async generateXenditInvoice(props: BookingProps, invCode: string) {
    const { Invoice } = this.xendit;
    const inv = new Invoice({});
    const customerProps = props.customer.getPropsCopy();

    const res = await inv.createInvoice({
      externalID: invCode,
      amount: props.grandTotal,
      description: `Payment for event ${props.eventName}`,
      customer: {
        email: customerProps.email,
      },
      invoiceDuration: 86400,
      items: props.services.map((s) => {
        const p = s.getPropsCopy();
        return { name: p.title, quantity: p.quantity, price: p.price };
      }),
    });

    return res;
  }
}
