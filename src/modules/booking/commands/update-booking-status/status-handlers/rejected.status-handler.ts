import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';
import { Result } from '@badrap/result';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { UnauthorizedException } from '@src/libs/exceptions';
import { BookingStatusHistoryEntity } from '@src/modules/booking/domain/entities/bookings-status-history.entity';

@Injectable()
export class RejectedHandler extends StatusHandler {
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
      const status = await bookingRepo.findByStatus(BookingStatus.REJECTED);
      const histories = bookingProps.histories;
      histories.push(
        new BookingStatusHistoryEntity({
          status,
        }),
      );
      if (bookingProps.artisan.id.value != request.user.id.value) {
        throw new UnauthorizedException();
      }
      if (
        bookingProps.status.status != BookingStatus.WAITING_FOR_CONFIRMATION
      ) {
        throw new Error();
      }
      const updated = BookingEntity.update({
        ...bookingProps,
        status: status,
        histories,
      });
      return Result.ok(updated);
    } catch (error) {
      return Result.err(error);
    }
  }
}
