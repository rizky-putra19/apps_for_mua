import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { BookingNotFound } from '@src/modules/booking/errors/booking.errors';
import { UpdateBookingStatusCommand } from '../update-booking-status.command';
import { StatusHandler } from './status-handler.interface';
import { Result } from '@badrap/result';
import { BookingStatus } from '@src/modules/booking/domain/enums/booking-status.enum';
import { BookingStatusHistoryEntity } from '@src/modules/booking/domain/entities/bookings-status-history.entity';
import moment from 'moment';
import { CommandBus } from '@nestjs/cqrs';
import { DomainEvent } from '@src/libs/ddd/domain/domain-events';
import { CompletedUpdatedEvent } from '@src/modules/booking/domain/events/completed-updated.event';

@Injectable()
export class CompletedHandler extends StatusHandler {
  private maksComplaintTime: string;
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly configService: ConfigService,
    protected readonly commandBus: CommandBus,
  ) {
    super(unitOfWork);
    this.maksComplaintTime = this.configService.get('maksComplaintTime');
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
      const user = command.user.getPropsCopy();
      const status = await bookingRepo.findByStatus(BookingStatus.COMPLETED);
      const histories = bookingProps.histories;
      histories.push(
        new BookingStatusHistoryEntity({
          status,
        }),
      );
      const currDate = moment();
      const updated = moment(bookingProps.updatedAt.value);
      const events: DomainEvent[] = [];
      events.push(
        new CompletedUpdatedEvent({
          bookingID: bookingProps.id.value,
          aggregateId: bookingProps.id.value,
        }),
      );
      if (bookingProps.status.status == BookingStatus.FINISHED) {
        if (currDate.diff(updated, 'hour') > Number(this.maksComplaintTime)) {
          const statusUpdated = BookingEntity.update(
            {
              ...bookingProps,
              status,
              histories,
            },
            events,
          );

          return Result.ok(statusUpdated);
        }
      }
      if (
        bookingProps.status.status != BookingStatus.OPEN_ISSUE ||
        user.type == 'artisan'
      ) {
        throw new Error();
      }

      const statusUpdated = BookingEntity.update({
        ...bookingProps,
        status,
        histories,
      });

      return Result.ok(statusUpdated);
    } catch (error) {
      return Result.err(error);
    }
  }
}
