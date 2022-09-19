import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { UpdateBookingStatusCommand } from '@src/modules/booking/commands/update-booking-status/update-booking-status.command';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { InvoiceEntity } from '@src/modules/invoice/domain/entities/invoice.entity';
import { InvoiceStatus } from '@src/modules/invoice/domain/enums/invoice-status.enum';
import { PaymentEntity } from '@src/modules/payment/domain/entities/payment-entity';
import { PaymentStatus } from '@src/modules/payment/domain/enum/payment-status.enum';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class XenditProvider implements PaymentProvider {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
  ) {}
  async handle(
    body: any,
    header: any,
    correlationId?: string,
  ): Promise<InvoiceEntity> {
    console.log(
      '🚀 ~ file: xendit.provider.ts ~ line 21 ~ XenditProvider ~ body',
      body,
    );
    const invoiceCode = body.external_id;
    const callbackToken = header['x-callback-token'];
    if (
      callbackToken == undefined ||
      this.configService.get('payments.providers.xendit.callbackToken') !=
        callbackToken
    ) {
      throw new BadRequestException('Invalid token');
    }

    const invoiceRepo = this.unitOfWork.getInvoiceRepository(correlationId);
    const invoice = await invoiceRepo.findOneOrThrow({
      code: invoiceCode,
    });
    const props = invoice.getPropsCopy();
    if (props.status.toUpperCase() == this.getStatus(body.status)) {
      console.log('not updating');
      return invoice;
    }
    const { booking, payment, ...invProps } = invoice.getPropsCopy();
    const invoiceEntity = new InvoiceEntity({
      id: invoice.id,
      props: {
        ...invoice.getPropsCopy(),
        status: InvoiceStatus[this.getStatus(body.status)],
        payment: new PaymentEntity({
          id: payment.id,
          props: {
            ...payment.getPropsCopy(),
            status: PaymentStatus[this.getStatus(body.status)],
            bankCode: body.bank_code,
            paymentChannel: body.payment_channel,
            paymentMethod: body.payment_method,
            callback: body,
          },
        }),
      },
    });
    if (PaymentStatus[body.status.toUpperCase()] == PaymentStatus.PAID) {
      await this.commandBus.execute(
        new UpdateBookingStatusCommand({
          id: booking.id.value,
          bookingStatus: BookingStatus.BOOKED,
        }),
      );
    }

    const res = await invoiceRepo.save(invoiceEntity);

    return res;
  }

  getStatus(status: string) {
    switch (status) {
      case 'PENDING':
        return 'UNPAID';
      case 'PAID':
      case 'SETTLED':
        return 'PAID';
      case 'EXPIRED':
        return 'EXPIRED';
      default:
        return status;
    }
  }
}
