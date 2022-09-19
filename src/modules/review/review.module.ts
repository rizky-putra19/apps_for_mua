import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingStatusHistoryOrmEntity } from '../booking/database/booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from '../booking/database/booking-status.orm-entity';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { BookingRepository } from '../booking/database/booking.repository';
import { FavoriteOrmEntity } from '../favorite/database/favorite.orm-entity';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { CreateReviewCommandHandler } from './commands/create-review/create-review.command-handler';
import { CreateReviewHttpController } from './commands/create-review/create-review.http-controller';
import { ReviewOrmEntity } from './database/review.orm-entity';
import { ReviewRepository } from './database/review.repository';
import { FindReviewHttpController } from './queries/find-review/find-review.http-controller';
import { FindReviewQueryHandler } from './queries/find-review/find-review.query.handler';

const httpControllers = [FindReviewHttpController, CreateReviewHttpController];

const commandHandlers = [CreateReviewCommandHandler];

const queryHandlers = [FindReviewQueryHandler];

const repositories = [
  ReviewRepository,
  UserRepository,
  BookingRepository,
  MediaRepository,
];

const typeOrm = TypeOrmModule.forFeature([
  ReviewOrmEntity,
  UserOrmEntity,
  UserMetadataOrmEntity,
  MediaOrmEntity,
  BookingOrmEntity,
  FavoriteOrmEntity,
  BookingStatusOrmEntity,
  BookingStatusHistoryOrmEntity,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule],
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...queryHandlers, ...repositories],
  exports: [...commandHandlers, ...queryHandlers, ...repositories, typeOrm],
})
export class ReviewModule {}
