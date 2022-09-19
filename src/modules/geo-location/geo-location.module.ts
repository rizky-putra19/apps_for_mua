import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { CreateUpdateCommandHandler } from '../device/commands/create-update/create-update.command-handler';
import { CreateUpdateHttpController } from '../device/commands/create-update/create-update.http-controller';
import { FavoriteOrmEntity } from '../favorite/database/favorite.orm-entity';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { ReviewOrmEntity } from '../review/database/review.orm-entity';
import { UserAddressRepository } from '../user/database/user-address.repository';
import { UserAddressOrmEntity } from '../user/database/user-addresses.orm-entity';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserMetadataRepository } from '../user/database/user-metadata.repository';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { CreateUpdateGeoLocationCommandHandler } from './commands/create-update-geo-location/create-update-geo-location.command-handler';
import { CreateUpdateGeoLocationHttpController } from './commands/create-update-geo-location/create-update-geo-location.http-controller';
import { GeoLocationHistoryOrmEntity } from './database/geo-location-history.orm-entity';
import { GeoLocationOrmEntity } from './database/geo-location.orm-entity';
import { GeoLocationRepository } from './database/geo-location.repository';
import { FindNearbyArtisanHttpController } from './queries/find-nearby-artisan/find-nearby-artisan.http-controller';
import { FindNearbyArtisanQueryHandler } from './queries/find-nearby-artisan/find-nearby-artisan.query-handler';

const httpControllers = [
  CreateUpdateGeoLocationHttpController,
  FindNearbyArtisanHttpController,
];
const repositories = [
  UserRepository,
  UserAddressRepository,
  UserMetadataRepository,
  MediaRepository,
  GeoLocationRepository,
];
const commandHandlers = [CreateUpdateGeoLocationCommandHandler];
const queryHandlers = [FindNearbyArtisanQueryHandler];
const typeOrm = TypeOrmModule.forFeature([
  UserOrmEntity,
  UserMetadataOrmEntity,
  ReviewOrmEntity,
  BookingOrmEntity,
  FavoriteOrmEntity,
  UserAddressOrmEntity,
  MediaOrmEntity,
  GeoLocationOrmEntity,
  GeoLocationHistoryOrmEntity,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule],
  controllers: [...httpControllers],
  providers: [...repositories, ...commandHandlers, ...queryHandlers],
  exports: [...repositories, ...commandHandlers, ...queryHandlers, typeOrm],
})
export class GeoLocationModule {}
