import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { BadRequestException } from '@src/libs/exceptions';
import {
  BookingEntity,
  BookingProps,
} from '@src/modules/booking/domain/entities/booking.entity';
import { BookingStatusHistoryEntity } from '@src/modules/booking/domain/entities/bookings-status-history.entity';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { InvoiceEntity } from '@src/modules/invoice/domain/entities/invoice.entity';
import { PaymentEntity } from '@src/modules/payment/domain/entities/payment-entity';
import moment from 'moment';
import Xendit from 'xendit-node';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';

@Injectable()
export class ConfirmedHandler extends StatusHandler {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly xendit: Xendit,
  ) {
    super(unitOfWork);
  }
  async handle(
    request: UpdateBookingStatusCommand,
    body?: { [key: string]: any },
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const bookingRepo = this.unitOfWork.getBookingRepository(
        request.correlationId,
      );

      const booking = await bookingRepo.findOneByIdOrThrow(request.id);
      const bookingProps = booking.getPropsCopy();
      const user = request.user.getPropsCopy();
      const status = await bookingRepo.findByStatus(BookingStatus.CONFIRMED);
      const histories = bookingProps.histories;
      histories.push(
        new BookingStatusHistoryEntity({
          status,
        }),
      );

      const statusUpdated = BookingEntity.update({
        ...bookingProps,
        status,
        histories,
        invoice: await this.generateInvoice(booking, request.correlationId),
      });

      if (
        bookingProps.status.status != BookingStatus.WAITING_FOR_CONFIRMATION
      ) {
        throw new Error();
      }

      if (user.id.value != bookingProps.artisan.id.value) {
        throw new BadRequestException();
      }

      return Result.ok(statusUpdated);
    } catch (err) {
      return Result.err(err);
    }
  }

  private async generateInvoice(
    booking: BookingEntity,
    correlationId: string,
  ): Promise<InvoiceEntity> {
    const invoiceRepo = this.unitOfWork.getInvoiceRepository(correlationId);
    const bookingProps = booking.getPropsCopy();
    const code = await invoiceRepo.generateCode(booking.id.value);
    const x: any = await this.generateXenditInvoice(bookingProps, code);

    return InvoiceEntity.create({
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
