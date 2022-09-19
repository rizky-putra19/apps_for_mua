import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { ReviewOrmEntity } from '../review/database/review.orm-entity';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { AddFavoriteCommandHandler } from './commands/add-favorite/add-favorite.command-handler';
import { AddFavoriteHttpController } from './commands/add-favorite/add-favorite.http.controller';
import { RemoveFavoriteCommandHandler } from './commands/remove-favorite/remove-favorite.command-handler';
import { RemoveFavoriteHttpController } from './commands/remove-favorite/remove-favorite.http.controller';
import { FavoriteOrmEntity } from './database/favorite.orm-entity';
import { FavoriteRepository } from './database/favorite.repository';

const httpControllers = [
  AddFavoriteHttpController,
  RemoveFavoriteHttpController,
];

const commandHandlers = [
  AddFavoriteCommandHandler,
  RemoveFavoriteCommandHandler,
];

const queryHandlers = [];

const repositories = [FavoriteRepository, UserRepository, MediaRepository];

const typeOrm = TypeOrmModule.forFeature([
  FavoriteOrmEntity,
  UserOrmEntity,
  UserMetadataOrmEntity,
  ReviewOrmEntity,
  BookingOrmEntity,
  MediaOrmEntity,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule],
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...queryHandlers, ...repositories],
  exports: [...commandHandlers, ...queryHandlers, ...repositories, typeOrm],
})
export class FavoriteModule {}
