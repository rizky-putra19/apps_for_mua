import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { DomainEventHandler } from '@src/libs/ddd/domain/domain-events';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { CancelByCustomerUpdatedEvent } from '@src/modules/booking/domain/events/cancel-by-customer-updated.event';
import { CreateFinanceCommand } from '@src/modules/finance/commands/create-finance/create-finance.command';
import { FinanceEntity } from '@src/modules/finance/domain/entities/finance-entity';
import { FinanceType } from '@src/modules/finance/domain/enums/finance-type.enum';
import { UpdateWalletCommand } from '@src/modules/wallet/commands/update-wallet/update-wallet.command';
import { WalletRepository } from '@src/modules/wallet/database/wallet.repository';
import { WalletHistoryEntity } from '@src/modules/wallet/domain/entities/wallet-history.entity';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { WalletHistoryStatus } from '@src/modules/wallet/domain/enums/wallet-history-status.enum';
import { WalletHistoryType } from '@src/modules/wallet/domain/enums/wallet-history-type.enum';
import moment from 'moment';

@Injectable()
export class UpdateWalletCancelByCustomerConditionEventHandler extends DomainEventHandler {
  private maksRefund: string;
  private platformFee: string;
  private onHoldPaymentOut: string;
  private refundedToCustomer: string;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly bookingRepository: BookingRepository,
    private readonly walletRepository: WalletRepository,
    private readonly configService: ConfigService,
  ) {
    super(CancelByCustomerUpdatedEvent);
    this.maksRefund = this.configService.get('maksDaysRefund');
    this.platformFee = this.configService.get('platformFee');
    this.onHoldPaymentOut = this.configService.get('onHoldPaymentOut');
    this.refundedToCustomer = this.configService.get('refundedToCustomer');
  }
  async handle(event: CancelByCustomerUpdatedEvent): Promise<void> {
    const { bookingID } = event;
    const booking = await this.bookingRepository.findOneByIdOrThrow(bookingID);
    const bookingProps = booking.getPropsCopy();
    const artisanID = bookingProps.artisan.id.value;
    const wallet = await this.walletRepository.findOneByUserId(artisanID);

    const currDate = moment();
    const eventDate = moment(bookingProps.eventDate);

    const result =
      currDate.diff(eventDate, 'days') <= Number(this.maksRefund)
        ? this.fiftyPercenRefund(wallet, artisanID, booking)
        : this.notRefund(wallet, artisanID, booking);
  }

  async fiftyPercenRefund(
    wallet: WalletEntity,
    artisanID: string,
    booking: BookingEntity,
  ) {
    const bookingProps = booking.getPropsCopy();

    const onHold = wallet.onHold - bookingProps.grandTotal;
    const readyToArtisanWallet = (50 / 100) * bookingProps.grandTotal;
    const readyExclPlatformFee =
      readyToArtisanWallet -
      (Number(this.platformFee) / 100) * readyToArtisanWallet;
    const ready = wallet.ready + readyExclPlatformFee;
    const currentBalance = onHold + ready;

    const histories = wallet.histories;
    histories.push(
      new WalletHistoryEntity({
        title: this.onHoldPaymentOut,
        description: `booking payment ${bookingProps.code} is ready to disbursed`,
        type: WalletHistoryType.DEBIT,
        status: WalletHistoryStatus.ON_HOLD,
        amount: readyToArtisanWallet,
        bookingCode: bookingProps.code,
      }),
      new WalletHistoryEntity({
        title: `booking payment - ${bookingProps.code}`,
        description: `booking transaction ${bookingProps.code} is successfull`,
        type: WalletHistoryType.CREDIT,
        status: WalletHistoryStatus.READY,
        amount: readyToArtisanWallet,
        bookingCode: bookingProps.code,
      }),
      new WalletHistoryEntity({
        title: this.refundedToCustomer,
        description: `booking payment ${bookingProps.code} is refunded to customer`,
        type: WalletHistoryType.DEBIT,
        status: WalletHistoryStatus.ON_HOLD,
        amount: readyToArtisanWallet,
        bookingCode: bookingProps.code,
      }),
    );

    const createFinanceDisburse: Result<FinanceEntity, Error> =
      await this.commandBus.execute(
        new CreateFinanceCommand({
          user: bookingProps.artisan,
          bookingCode: bookingProps.code,
          amount: readyExclPlatformFee,
          financeType: FinanceType.DISBURSE,
        }),
      );

    const result: Result<WalletEntity, Error> = await this.commandBus.execute(
      new UpdateWalletCommand({
        artisanID,
        currentBalance,
        onHold,
        ready,
        histories,
      }),
    );

    return result;
  }

  async notRefund(
    wallet: WalletEntity,
    artisanID: string,
    booking: BookingEntity,
  ) {
    const bookingProps = booking.getPropsCopy();

    const onHold = wallet.onHold - bookingProps.grandTotal;
    const readyExclPlatformFee =
      bookingProps.grandTotal -
      (Number(this.platformFee) / 100) * bookingProps.grandTotal;
    const ready = wallet.ready + readyExclPlatformFee;
    const currentBalance = onHold + ready;

    const histories = wallet.histories;
    histories.push(
      new WalletHistoryEntity({
        title: this.onHoldPaymentOut,
        description: `booking payment ${bookingProps.code} is ready to disbursed`,
        type: WalletHistoryType.DEBIT,
        status: WalletHistoryStatus.ON_HOLD,
        amount: bookingProps.grandTotal,
        bookingCode: bookingProps.code,
      }),
      new WalletHistoryEntity({
        title: `booking payment - ${bookingProps.code}`,
        description: `booking transaction ${bookingProps.code} is successfull`,
        type: WalletHistoryType.CREDIT,
        status: WalletHistoryStatus.READY,
        amount: bookingProps.grandTotal,
        bookingCode: bookingProps.code,
      }),
    );

    const createFinanceDisburse: Result<FinanceEntity, Error> =
      await this.commandBus.execute(
        new CreateFinanceCommand({
          user: bookingProps.artisan,
          bookingCode: bookingProps.code,
          amount: readyExclPlatformFee,
          financeType: FinanceType.DISBURSE,
        }),
      );

    const result: Result<WalletEntity, Error> = await this.commandBus.execute(
      new UpdateWalletCommand({
        artisanID,
        currentBalance,
        onHold,
        ready,
        histories,
      }),
    );

    return result;
  }
}
