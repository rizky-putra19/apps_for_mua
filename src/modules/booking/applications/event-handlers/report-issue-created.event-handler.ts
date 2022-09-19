import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DomainEventHandler } from '@src/libs/ddd/domain/domain-events';
import { ReportIssueCreatedEvent } from '@src/modules/report-issue/domain/events/report-issue-created.event';
import { UpdateBookingStatusCommand } from '../../commands/update-booking-status/update-booking-status.command';
import { BookingRepository } from '../../database/booking.repository';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { BookingNotFound } from '../../errors/booking.errors';

@Injectable()
export class ReportIssueCreatedEventHandler extends DomainEventHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly bookingRepository: BookingRepository,
  ) {
    super(ReportIssueCreatedEvent);
  }
  async handle(event: ReportIssueCreatedEvent): Promise<void> {
    const { bookingId } = event;
    const booking = await this.bookingRepository.findOneByIdOrThrow(bookingId);
    const bookingProps = booking.getPropsCopy();

    const result: Result<BookingEntity, BookingNotFound> =
      await this.commandBus.execute(
        new UpdateBookingStatusCommand({
          id: bookingProps.id.value,
          bookingStatus: BookingStatus.OPEN_ISSUE,
          user: bookingProps.customer,
        }),
      );
  }
}
