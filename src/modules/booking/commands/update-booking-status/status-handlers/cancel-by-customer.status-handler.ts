import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { DomainEvent } from '@src/libs/ddd/domain/domain-events';
import { UnauthorizedException } from '@src/libs/exceptions';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { CancelByCustomerUpdatedEvent } from '@src/modules/booking/domain/events/cancel-by-customer-updated.event';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';

@Injectable()
export class CancelByCustomerHandler extends StatusHandler {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    request: UpdateBookingStatusCommand,
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const bookingRepo = this.unitOfWork.getBookingRepository(
        request.correlationId,
      );
      const booking = await bookingRepo.findOneByIdOrThrow(request.id);
      const bookingProps = booking.getPropsCopy();
      const status = await bookingRepo.findByStatus(
        BookingStatus.CANCELED_BY_CUSTOMER,
      );
      const histories = bookingProps.histories;
      histories.push({
        status,
      });
      const events: DomainEvent[] = [];
      events.push(
        new CancelByCustomerUpdatedEvent({
          bookingID: bookingProps.id.value,
          aggregateId: bookingProps.id.value,
        }),
      );
      if (bookingProps.customer.id.value != request.user.id.value) {
        throw new UnauthorizedException();
      }
      if (
        bookingProps.status.status != BookingStatus.WAITING_FOR_CONFIRMATION &&
        bookingProps.status.status != BookingStatus.BOOKED
      ) {
        throw new Error();
      }
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
