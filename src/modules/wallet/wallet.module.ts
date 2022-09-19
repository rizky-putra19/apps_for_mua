import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { UserAddressRepository } from '../user/database/user-address.repository';
import { UserAddressOrmEntity } from '../user/database/user-addresses.orm-entity';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserMetadataRepository } from '../user/database/user-metadata.repository';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { UserModule } from '../user/user.module';
import { CreateWalletCommandHandler } from './commands/create-wallet/create-wallet.command-handler';
import { CreateWalletHttpController } from './commands/create-wallet/create-wallet.http.controller';
import { UpdateWalletCommandHandler } from './commands/update-wallet/update-wallet.command-handler';
import { UpdateWalletHttpController } from './commands/update-wallet/update-wallet.http.controller';
import { WalletHistoryOrmEntity } from './database/wallet-history.orm-entity';
import { WalletOrmEntity } from './database/wallet.orm-entity';
import { WalletRepository } from './database/wallet.repository';
import { FindWalletHistoryHttpController } from './queries/find-wallet-history/find-wallet-history.http.controller';
import { FindWalletHistoryQueryHandler } from './queries/find-wallet-history/find-wallet-history.query-handler';
import { GetWalletHttpController } from './queries/get-wallet/get-wallet.http.controller';
import { GetWalletQueryHandler } from './queries/get-wallet/get-wallet.query-handler';
import {
  updateWalletWhenBookedCondition,
  updateWalletWhenCancelByArtisanCondition,
  updateWalletWhenCancelByCustomerCondition,
  updateWalletWhenCompletedCondition,
} from './wallet.provider';

const httpControllers = [
  CreateWalletHttpController,
  UpdateWalletHttpController,
  GetWalletHttpController,
  FindWalletHistoryHttpController,
];
const repositories = [
  UserRepository,
  UserAddressRepository,
  UserMetadataRepository,
  MediaRepository,
  WalletRepository,
];
const commandHandlers = [
  CreateWalletCommandHandler,
  UpdateWalletCommandHandler,
];
const queryHandlers = [GetWalletQueryHandler, FindWalletHistoryQueryHandler];
const typeOrm = TypeOrmModule.forFeature([
  UserOrmEntity,
  UserMetadataOrmEntity,
  UserAddressOrmEntity,
  MediaOrmEntity,
  WalletOrmEntity,
  WalletHistoryOrmEntity,
]);
const providers = [
  updateWalletWhenBookedCondition,
  updateWalletWhenCompletedCondition,
  updateWalletWhenCancelByArtisanCondition,
  updateWalletWhenCancelByCustomerCondition,
];

@Module({
  imports: [typeOrm, CqrsModule, HttpModule, UserModule],
  controllers: [...httpControllers],
  providers: [
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...providers,
  ],
  exports: [...repositories, ...commandHandlers, ...queryHandlers, typeOrm],
})
export class WalletModule {}
