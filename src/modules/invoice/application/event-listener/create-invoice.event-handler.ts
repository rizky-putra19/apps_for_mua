import { Result } from '@badrap/result';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  DomainEvent,
  DomainEventHandler,
} from '@src/libs/ddd/domain/domain-events';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingUpdatedEvent } from '@src/modules/booking/domain/events/booking-updated.event';
import { GetBookingQuery } from '@src/modules/booking/queries/get-booking/get-booking.query';
import { CreateInvoiceCommand } from '../../commands/create-invoice/create-invoice.command';

export class CreateInvoiceEventWhenBookingIsConfirmedEventHandler extends DomainEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super(BookingUpdatedEvent);
  }
  async handle(event: BookingUpdatedEvent): Promise<void> {
    const { id } = event;

    const bookingResult: Result<BookingEntity> = await this.queryBus.execute(
      new GetBookingQuery({
        bookingID: id.value,
      }),
    );

    await this.commandBus.execute(
      new CreateInvoiceCommand({
        booking: bookingResult.unwrap(),
      }),
    );
  }
}
