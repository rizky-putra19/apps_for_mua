import { Provider } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ReportIssueCreatedEventHandler } from './applications/event-handlers/report-issue-created.event-handler';
import { BookingRepository } from './database/booking.repository';

export const reportIssueCreated: Provider = {
  provide: ReportIssueCreatedEventHandler,
  useFactory: (
    commandBus: CommandBus,
    bookingRepository: BookingRepository,
  ): ReportIssueCreatedEventHandler => {
    const eventHandler = new ReportIssueCreatedEventHandler(
      commandBus,
      bookingRepository,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [CommandBus, BookingRepository],
};
