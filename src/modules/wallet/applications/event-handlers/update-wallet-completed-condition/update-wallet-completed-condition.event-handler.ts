import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { DomainEventHandler } from '@src/libs/ddd/domain/domain-events';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { CompletedUpdatedEvent } from '@src/modules/booking/domain/events/completed-updated.event';
import { CreateFinanceCommand } from '@src/modules/finance/commands/create-finance/create-finance.command';
import { FinanceEntity } from '@src/modules/finance/domain/entities/finance-entity';
import { FinanceType } from '@src/modules/finance/domain/enums/finance-type.enum';
import { UpdateWalletCommand } from '@src/modules/wallet/commands/update-wallet/update-wallet.command';
import { WalletRepository } from '@src/modules/wallet/database/wallet.repository';
import { WalletHistoryEntity } from '@src/modules/wallet/domain/entities/wallet-history.entity';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { WalletHistoryStatus } from '@src/modules/wallet/domain/enums/wallet-history-status.enum';
import { WalletHistoryType } from '@src/modules/wallet/domain/enums/wallet-history-type.enum';

@Injectable()
export class UpdateWalletCompletedConditionEventHandler extends DomainEventHandler {
  private platformFee: string;
  private onHoldPaymentOut: string;
  constructor(
    protected readonly commandBus: CommandBus,
    protected readonly bookingRepository: BookingRepository,
    protected readonly walletRepository: WalletRepository,
    protected readonly configService: ConfigService,
  ) {
    super(CompletedUpdatedEvent);
    this.platformFee = this.configService.get('platformFee');
    this.onHoldPaymentOut = this.configService.get('onHoldPaymentOut');
  }
  async handle(event: CompletedUpdatedEvent): Promise<void> {
    const { bookingID } = event;
    const booking = await this.bookingRepository.findOneByIdOrThrow(bookingID);
    const bookingProps = booking.getPropsCopy();
    const artisanID = bookingProps.artisan.id.value;
    const wallet = await this.walletRepository.findOneByUserId(artisanID);

    const onHold = wallet.onHold - bookingProps.grandTotal;
    const readyExclPlatformFee =
      bookingProps.grandTotal -
      (Number(this.platformFee) / 100) * bookingProps.grandTotal;
    const ready = wallet.ready + readyExclPlatformFee;
    const currentBalance = onHold + ready;

    const histories = wallet.histories;
    histories.push(
      new WalletHistoryEntity({
        title: `booking payment - ${bookingProps.code}`,
        description: `booking transaction ${bookingProps.code} is successfull`,
        type: WalletHistoryType.CREDIT,
        status: WalletHistoryStatus.READY,
        amount: bookingProps.grandTotal,
        bookingCode: bookingProps.code,
      }),
      new WalletHistoryEntity({
        title: this.onHoldPaymentOut,
        description: `booking payment ${bookingProps.code} is ready to disbursed`,
        type: WalletHistoryType.DEBIT,
        status: WalletHistoryStatus.ON_HOLD,
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
  }
}
