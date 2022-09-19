import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';
import { Result } from '@badrap/result';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import moment from 'moment';
import { BookingStatusHistoryEntity } from '@src/modules/booking/domain/entities/bookings-status-history.entity';

@Injectable()
export class PaymentExpiredHandler extends StatusHandler {
  private maksResponse: string;
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly configService: ConfigService,
  ) {
    super(unitOfWork);
    this.maksResponse = this.configService.get('maksResponseTime');
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
      const status = await bookingRepo.findByStatus(
        BookingStatus.PAYMENT_EXPIRED,
      );
      const histories = bookingProps.histories;
      histories.push(
        new BookingStatusHistoryEntity({
          status,
        }),
      );
      const bookingHistory = bookingProps.histories.find(
        (h) => h.status.status == BookingStatus.CONFIRMED,
      );
      const currDate = moment();
      const created = moment(bookingHistory.createdAt);
      if (currDate.diff(created, 'minutes') > Number(this.maksResponse)) {
        const updated = BookingEntity.update({
          ...bookingProps,
          status,
          histories,
        });

        return Result.ok(updated);
      }

      return Result.ok(booking);
    } catch (error) {
      return Result.err(error);
    }
  }
}
