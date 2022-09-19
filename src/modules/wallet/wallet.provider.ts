import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { BookingRepository } from '../booking/database/booking.repository';
import { UpdateWalletBookedConditionEventHandler } from './applications/event-handlers/update-wallet-booked-condition/update-wallet-booked-condition.event-handler';
import { UpdateWalletCancelByArtisanConditionEventHandler } from './applications/event-handlers/update-wallet-cancel-by-artisan-condition/update-wallet-cancel-by-artisan-condition.event-handler';
import { UpdateWalletCancelByCustomerConditionEventHandler } from './applications/event-handlers/update-wallet-cancel-by-customer-condition/update-wallet-cancel-by-customer-condition.event-handler';
import { UpdateWalletCompletedConditionEventHandler } from './applications/event-handlers/update-wallet-completed-condition/update-wallet-completed-condition.event-handler';
import { WalletRepository } from './database/wallet.repository';

export const updateWalletWhenBookedCondition: Provider = {
  provide: UpdateWalletBookedConditionEventHandler,
  useFactory: (
    commandBus: CommandBus,
    bookingRepository: BookingRepository,
    walletRepository: WalletRepository,
    configService: ConfigService,
  ): UpdateWalletBookedConditionEventHandler => {
    const eventHandler = new UpdateWalletBookedConditionEventHandler(
      commandBus,
      bookingRepository,
      walletRepository,
      configService,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [CommandBus, BookingRepository, WalletRepository, ConfigService],
};

export const updateWalletWhenCompletedCondition: Provider = {
  provide: UpdateWalletCompletedConditionEventHandler,
  useFactory: (
    commandBus: CommandBus,
    bookingRepository: BookingRepository,
    walletRepository: WalletRepository,
    configService: ConfigService,
  ): UpdateWalletCompletedConditionEventHandler => {
    const eventHandler = new UpdateWalletCompletedConditionEventHandler(
      commandBus,
      bookingRepository,
      walletRepository,
      configService,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [CommandBus, BookingRepository, WalletRepository, ConfigService],
};

export const updateWalletWhenCancelByArtisanCondition: Provider = {
  provide: UpdateWalletCancelByArtisanConditionEventHandler,
  useFactory: (
    commandBus: CommandBus,
    bookingRepository: BookingRepository,
    walletRepository: WalletRepository,
    configService: ConfigService,
  ): UpdateWalletCancelByArtisanConditionEventHandler => {
    const eventHandler = new UpdateWalletCancelByArtisanConditionEventHandler(
      commandBus,
      bookingRepository,
      walletRepository,
      configService,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [CommandBus, BookingRepository, WalletRepository, ConfigService],
};

export const updateWalletWhenCancelByCustomerCondition: Provider = {
  provide: UpdateWalletCancelByCustomerConditionEventHandler,
  useFactory: (
    commandBus: CommandBus,
    bookingRepository: BookingRepository,
    walletRepository: WalletRepository,
    configService: ConfigService,
  ): UpdateWalletCancelByCustomerConditionEventHandler => {
    const eventHandler = new UpdateWalletCancelByCustomerConditionEventHandler(
      commandBus,
      bookingRepository,
      walletRepository,
      configService,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [CommandBus, BookingRepository, WalletRepository, ConfigService],
};
