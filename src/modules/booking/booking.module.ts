import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateBookingCommandHandler } from './commands/create-booking/create-booking.command-handler';
import { BookingHttpController } from './commands/create-booking/create-booking.http-controller';
import { BookingServiceOrmEntity } from './database/booking-service.orm-entity';
import { BookingVenueOrmEntity } from './database/booking-venue.orm-entity';
import { BookingOrmEntity } from './database/booking.orm-entity';
import { UpdateBookingStatusHttpController } from './commands/update-booking-status/update-booking-status.http-controller';
import { UpdateBookingStatusCommandHandler } from './commands/update-booking-status/update-booking-status.command-handler';
import { GetBookingQueryHandler } from './queries/get-booking/get-booking.query-handler';
import { GetBookingHttpController } from './queries/get-booking/get-booking.http.controller';
import { FindBookingQueryHandler } from './queries/find-booking/find-booking.query-handler';
import { FindBookingHttpController } from './queries/find-booking/find-booking.http-controller';
import { BookingRepository } from './database/booking.repository';
import { UserModule } from '../user/user.module';
import { MediaModule } from '../media/media.module';
import { BookingStatusHistoryOrmEntity } from './database/booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from './database/booking-status.orm-entity';
import { StatusHandler } from './commands/update-booking-status/status-handlers/status-handler.interface';
import { CancelArtisanNoResponseHandler } from './commands/update-booking-status/status-handlers/cancel-artisan-no-response.status-handler';
import { BookingStatus } from './domain/enums/booking-status.enum';
import { RejectedHandler } from './commands/update-booking-status/status-handlers/rejected.status-handler';
import { InProgressHandler } from './commands/update-booking-status/status-handlers/in-progress.status-handler';
import { FinishedHandler } from './commands/update-booking-status/status-handlers/finished.status-handler';
import { CancelByCustomerHandler } from './commands/update-booking-status/status-handlers/cancel-by-customer.status-handler';
import { CancelByArtisanHandler } from './commands/update-booking-status/status-handlers/cancel-by-artisan.status-handler';
import { PaymentExpiredHandler } from './commands/update-booking-status/status-handlers/payment-expired.status-handler';
import { OpenIssueHandler } from './commands/update-booking-status/status-handlers/open-issue.status-handler';
import { RequestRefundHandler } from './commands/update-booking-status/status-handlers/request-refund.status-handler';
import { RefundedHandler } from './commands/update-booking-status/status-handlers/refunded.status-handler';
import { CompletedHandler } from './commands/update-booking-status/status-handlers/completed.status-handler';
import { ConfirmedHandler } from './commands/update-booking-status/status-handlers/confirmed.status-handler';
import { PaymentModule } from '../payment/payment.module';
import { GetProcessCodeQueryHandler } from './queries/get-process-code/get-process-code.query-handler';
import { GetProcessCodeHttpController } from './queries/get-process-code/get-process-code.http.controller';
import { BookedHandler } from './commands/update-booking-status/status-handlers/booked.status-handler';
import { FindBookingDashboardHttpController } from './queries/find-booking/find-booking-admin.http-controller';
import { CheckScheduleHttpController } from './commands/check-schedule/check-schedule.http-controller';
import { CheckScheduleCommandHandler } from './commands/check-schedule/check-schedule.command-handler';
import { reportIssueCreated } from './booking.provider';

const statusHandler = [
  CancelArtisanNoResponseHandler,
  RejectedHandler,
  InProgressHandler,
  FinishedHandler,
  CancelByCustomerHandler,
  CancelByArtisanHandler,
  PaymentExpiredHandler,
  OpenIssueHandler,
  RequestRefundHandler,
  RefundedHandler,
  CompletedHandler,
  ConfirmedHandler,
  BookedHandler,
];
const repositories = [BookingRepository];
const queryHandlers = [
  GetBookingQueryHandler,
  FindBookingQueryHandler,
  GetProcessCodeQueryHandler,
];
const commandHandlers = [
  CreateBookingCommandHandler,
  UpdateBookingStatusCommandHandler,
  CheckScheduleCommandHandler,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingOrmEntity,
      BookingServiceOrmEntity,
      BookingVenueOrmEntity,
      BookingStatusHistoryOrmEntity,
      BookingStatusOrmEntity,
    ]),
    CqrsModule,
    UserModule,
    MediaModule,
    PaymentModule,
  ],

  providers: [
    CreateBookingCommandHandler,
    UpdateBookingStatusCommandHandler,
    GetBookingQueryHandler,
    FindBookingQueryHandler,
    BookingRepository,
    reportIssueCreated,
    ...queryHandlers,
    ...commandHandlers,
    ...repositories,
    ...statusHandler,
    {
      provide: 'STATUS_HANDLER',
      useFactory: (
        cancelArtisanNoResponseHandler: CancelArtisanNoResponseHandler,
        rejectedHandler: RejectedHandler,
        inProgressHandler: InProgressHandler,
        finishedHandler: FinishedHandler,
        cancelByCustomerHandler: CancelByCustomerHandler,
        cancelByArtisanHandler: CancelByArtisanHandler,
        paymentExpiredHandler: PaymentExpiredHandler,
        openIssueHandler: OpenIssueHandler,
        requestRefundHandler: RequestRefundHandler,
        refundedHandler: RefundedHandler,
        completedHandler: CompletedHandler,
        confirmedHandler: ConfirmedHandler,
        bookedHandler: BookedHandler,
      ): Map<BookingStatus, StatusHandler> => {
        const handlers = new Map();
        handlers.set(
          BookingStatus.CANCEL_BY_SYSTEM,
          cancelArtisanNoResponseHandler,
        );
        handlers.set(BookingStatus.REJECTED, rejectedHandler);
        handlers.set(BookingStatus.WORK_IN_PROGRESS, inProgressHandler);
        handlers.set(BookingStatus.FINISHED, finishedHandler);
        handlers.set(
          BookingStatus.CANCELED_BY_CUSTOMER,
          cancelByCustomerHandler,
        );
        handlers.set(BookingStatus.CANCELED_BY_ARTISAN, cancelByArtisanHandler);
        handlers.set(BookingStatus.PAYMENT_EXPIRED, paymentExpiredHandler);
        handlers.set(BookingStatus.OPEN_ISSUE, openIssueHandler);
        handlers.set(BookingStatus.WAITING_FOR_REFUND, requestRefundHandler);
        handlers.set(BookingStatus.REFUNDED, refundedHandler);
        handlers.set(BookingStatus.COMPLETED, completedHandler);
        handlers.set(BookingStatus.CONFIRMED, confirmedHandler);
        handlers.set(BookingStatus.BOOKED, bookedHandler);
        return handlers;
      },
      inject: [...statusHandler],
    },
  ],
  controllers: [
    BookingHttpController,
    UpdateBookingStatusHttpController,
    FindBookingDashboardHttpController,
    GetBookingHttpController,
    FindBookingHttpController,
    GetProcessCodeHttpController,
    CheckScheduleHttpController,
  ],
})
export class BookingModule {}
