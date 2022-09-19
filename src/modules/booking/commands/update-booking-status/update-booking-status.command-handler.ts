import { Result } from '@badrap/result';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { BookingNotFound } from '../../errors/booking.errors';
import { StatusHandler } from './status-handlers/status-handler.interface';
import { UpdateBookingStatusCommand } from './update-booking-status.command';

@CommandHandler(UpdateBookingStatusCommand)
export class UpdateBookingStatusCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    @Inject('STATUS_HANDLER')
    private readonly statusHandlers: Map<BookingStatus, StatusHandler>,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateBookingStatusCommand,
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const bookingRepo = this.unitOfWork.getBookingRepository(
        command.correlationId,
      );
      const status = await bookingRepo.findByStatus(command.bookingStatus);
      const statusHandlers = this.statusHandlers.get(status.status);
      const handler = await statusHandlers.handle(command);

      const bookingEntity = handler.unwrap((b) => b);

      const result = await bookingRepo.save(bookingEntity);
      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
