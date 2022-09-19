import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { Result } from '@badrap/result';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';

export abstract class StatusHandler {
  constructor(protected readonly unitOfWork: UnitOfWork) {}

  abstract handle(
    request: UpdateBookingStatusCommand,
    body?: { [key: string]: any },
  ): Promise<Result<BookingEntity, BookingNotFound>>;
}
