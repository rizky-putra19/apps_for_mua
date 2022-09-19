import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
import { BookingServiceOrmEntity } from '../booking/database/booking-service.orm-entity';
import { BookingStatusHistoryOrmEntity } from '../booking/database/booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from '../booking/database/booking-status.orm-entity';
import { BookingVenueOrmEntity } from '../booking/database/booking-venue.orm-entity';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { BookingRepository } from '../booking/database/booking.repository';
import { FavoriteOrmEntity } from '../favorite/database/favorite.orm-entity';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { ReasonOrmEntiy } from '../reasons/database/reason.orm-entity';
import { ReasonRepository } from '../reasons/database/reason.repository';
import { ReasonModule } from '../reasons/reason.module';
import { ReviewOrmEntity } from '../review/database/review.orm-entity';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { CreateReportIssueCommandHandler } from './commands/create-report-issue/create-report-issue.command-handler';
import { CreateReportIssueHttpController } from './commands/create-report-issue/create-report-issue.http-controller';
import { ReportIssueOrmEntity } from './database/report-issue.orm-entity';
import { ReportIssueRepository } from './database/report-issue.repository';

const httpControllers = [CreateReportIssueHttpController];

const repositories = [
  ReasonRepository,
  BookingRepository,
  ReportIssueRepository,
  UserRepository,
  MediaRepository,
];

const commandHandlers = [CreateReportIssueCommandHandler];

const queryHandlers = [];

const typeOrm = TypeOrmModule.forFeature([
  ReportIssueOrmEntity,
  BookingOrmEntity,
  BookingServiceOrmEntity,
  BookingVenueOrmEntity,
  BookingStatusHistoryOrmEntity,
  BookingStatusOrmEntity,
  UserOrmEntity,
  UserMetadataOrmEntity,
  ReviewOrmEntity,
  FavoriteOrmEntity,
  MediaOrmEntity,
  ReasonOrmEntiy,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule, BookingModule],
  controllers: [...httpControllers],
  providers: [...repositories, ...commandHandlers, ...queryHandlers],
  exports: [...repositories, ...commandHandlers, ...queryHandlers, typeOrm],
})
export class ReportIssueModule {}
