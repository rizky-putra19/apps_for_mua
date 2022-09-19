import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserService } from './commands/create-user/create-user.service';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import {
  createUserCliLoggerProvider,
  jwtUtil,
  sendVerifyEmailWhenUserCreated,
} from './user.provider';
import { GetUserHttpController } from './queries/get-user/get-user.http.controller';
import { GetUserQueryHandler } from './queries/get-user/get-user.query-handler';
import { ValidatePasswordHttpController } from './queries/validate-password/validate-user.http.controller';
import { ValidateUserQueryHandler } from './queries/validate-password/validate-user.query-handler';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FindUserHttpController } from './queries/find-user/find-user.http.controller';
import { FindUserQueryHandler } from './queries/find-user/find-user.query-handler';
import { UserCreatedEventHandler } from './commands/user-created-event/user-created-event.handler';
import { UserUpdatedEventHandler } from './commands/user-updated-event/user-updated-event.handlers';
import { UpdateUserHttpController } from './commands/update-user/update-user.http.controller';
import { UpdateUserCommandHandler } from './commands/update-user/update-user.command-handler';
import { UserMetadataOrmEntity } from './database/user-metadata.orm-entity';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { UpdatePasswordHttpController } from './commands/update-password/update-password.http.controller';
import { UpdatePasswordCommandHandler } from './commands/update-password/update-password.command-handler';
import { CacheService } from '@src/libs/ddd/infrastructure/cache/cache.service';
import { RedisCache } from '@src/libs/ddd/infrastructure/cache/redis.cache';
import { GetUserLegacyQueryHandler } from './queries/get-user/get-user-legacy-query-handler';
import { MediaModule } from '../media/media.module';
import { FindArtisanCustomerListQueryHandler } from './queries/find-artisan-customer-list/find-artisan-customer-list.query-handler';
import { FindArtisanCustomerListHttpController } from './queries/find-artisan-customer-list/find-artisan-customer-list.http-controller';
import { UserAddressOrmEntity } from './database/user-addresses.orm-entity';
import { UserAddressRepository } from './database/user-address.repository';
import { FavoriteRepository } from '../favorite/database/favorite.repository';
import { FavoriteOrmEntity } from '../favorite/database/favorite.orm-entity';
import { GetArtisanQueryHandler } from './queries/get-user/get-artisan.query-handler';
import { FavoriteModule } from '../favorite/favorite.module';
import { ReviewRepository } from '../review/database/review.repository';
import { ReviewOrmEntity } from '../review/database/review.orm-entity';
import { BookingRepository } from '../booking/database/booking.repository';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { BookingStatusOrmEntity } from '../booking/database/booking-status.orm-entity';
import { BookingStatusHistoryOrmEntity } from '../booking/database/booking-status-history.orm-entity';
import { ServiceRepository } from '../service/database/service.repository';
import { ServiceOrmEntity } from '../service/database/service.orm-entity';
import { CategoryRepository } from '../category/database/category.repository';
import { CategoryOrmEntity } from '../category/database/category.orm-entity';
import { AddAddressCommandHandler } from './commands/add-address/add-address.command-handler';
import { EditAddressCommandHandler } from './commands/edit-address/edit-address.command-handler';
import { GetAddressesQueryHandler } from './queries/get-addresses/get-addresses.query-handler';
import { UserMetadataRepository } from './database/user-metadata.repository';
import { AddMetadataCommandHandler } from './commands/add-user-metadata/add-user-metadata.command-handler';
import { EditMetadataCommandHandler } from './commands/edit-user-metadata/edit-user-metadata.command-handler';

const httpControllers = [
  CreateUserHttpController,
  UpdateUserHttpController,
  ValidatePasswordHttpController,
  GetUserHttpController,
  FindUserHttpController,
  FindArtisanCustomerListHttpController,
  UserCreatedEventHandler,
  UserUpdatedEventHandler,
  UpdatePasswordHttpController,
];
const repositories = [
  UserRepository,
  UserAddressRepository,
  FavoriteRepository,
  ReviewRepository,
  BookingRepository,
  ServiceRepository,
  CategoryRepository,
  UserMetadataRepository,
];
const commandHandlers = [
  CreateUserService,
  UpdateUserCommandHandler,
  UpdatePasswordCommandHandler,
  AddAddressCommandHandler,
  EditAddressCommandHandler,
  AddMetadataCommandHandler,
  EditMetadataCommandHandler,
];
const queryHandlers = [
  GetUserQueryHandler,
  GetArtisanQueryHandler,
  ValidateUserQueryHandler,
  FindArtisanCustomerListQueryHandler,
  FindUserQueryHandler,
  GetUserLegacyQueryHandler,
  GetAddressesQueryHandler,
];
const typeOrm = TypeOrmModule.forFeature([
  UserOrmEntity,
  UserMetadataOrmEntity,
  UserAddressOrmEntity,
  FavoriteOrmEntity,
  ReviewOrmEntity,
  BookingOrmEntity,
  BookingStatusOrmEntity,
  BookingStatusHistoryOrmEntity,
  ServiceOrmEntity,
  CategoryOrmEntity,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule, MediaModule, FavoriteModule],
  controllers: [...httpControllers],
  providers: [
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    createUserCliLoggerProvider,
    sendVerifyEmailWhenUserCreated,
    jwtUtil,
    MailgunClient,
    FirebaseClient,
    {
      provide: CacheService,
      useFactory: (config) => {
        return new CacheService(new RedisCache(config));
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    jwtUtil,
    typeOrm,
  ],
})
export class UserModule {}
