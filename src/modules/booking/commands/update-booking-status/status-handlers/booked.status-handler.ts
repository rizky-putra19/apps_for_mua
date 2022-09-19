import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { DomainEvent } from '@src/libs/ddd/domain/domain-events';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingStatusHistoryEntity } from '@src/modules/booking/domain/entities/bookings-status-history.entity';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { BookedUpdatedEvent } from '@src/modules/booking/domain/events/booked-updated.event';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';

@Injectable()
export class BookedHandler extends StatusHandler {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateBookingStatusCommand,
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const bookingRepo = this.unitOfWork.getBookingRepository(
        command.correlationId,
      );
      const booking = await bookingRepo.findOneByIdOrThrow(command.id);
      const bookingProps = booking.getPropsCopy();
      const status = await bookingRepo.findByStatus(BookingStatus.BOOKED);
      const histories = bookingProps.histories;
      histories.push(
        new BookingStatusHistoryEntity({
          status,
        }),
      );
      const events: DomainEvent[] = [];
      events.push(
        new BookedUpdatedEvent({
          bookingID: bookingProps.id.value,
          aggregateId: bookingProps.id.value,
        }),
      );

      const updated = BookingEntity.update(
        {
          ...bookingProps,
          status,
          histories,
        },
        events,
      );

      return Result.ok(updated);
    } catch (error) {
      return Result.err(error);
    }
  }
}
