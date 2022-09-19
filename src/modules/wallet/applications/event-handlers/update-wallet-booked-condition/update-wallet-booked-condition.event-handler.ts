import { Result } from '@badrap/result';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { DomainEventHandler } from '@src/libs/ddd/domain/domain-events';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { BookedUpdatedEvent } from '@src/modules/booking/domain/events/booked-updated.event';
import { UpdateWalletCommand } from '@src/modules/wallet/commands/update-wallet/update-wallet.command';
import { WalletRepository } from '@src/modules/wallet/database/wallet.repository';
import { WalletHistoryEntity } from '@src/modules/wallet/domain/entities/wallet-history.entity';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { WalletHistoryStatus } from '@src/modules/wallet/domain/enums/wallet-history-status.enum';
import { WalletHistoryType } from '@src/modules/wallet/domain/enums/wallet-history-type.enum';

@Injectable()
export class UpdateWalletBookedConditionEventHandler extends DomainEventHandler {
  private onHoldPaymentIn: string;
  constructor(
    private readonly commandBus: CommandBus,
    private readonly bookingRepository: BookingRepository,
    private readonly walletRepository: WalletRepository,
    private readonly configService: ConfigService,
  ) {
    super(BookedUpdatedEvent);
    this.onHoldPaymentIn = this.configService.get('onHoldPaymentIn');
  }
  async handle(event: BookedUpdatedEvent): Promise<void> {
    const { bookingID } = event;
    const booking = await this.bookingRepository.findOneByIdOrThrow(bookingID);
    const bookingProps = booking.getPropsCopy();
    const artisanID = bookingProps.artisan.id.value;
    const wallet = await this.walletRepository.findOneByUserId(artisanID);

    const onHold = wallet.onHold + bookingProps.grandTotal;
    const currentBalance = onHold + wallet.ready;

    const histories = wallet.histories;
    histories.push(
      new WalletHistoryEntity({
        title: this.onHoldPaymentIn,
        description: `booking transaction ${bookingProps.code} is succesfull`,
        type: WalletHistoryType.CREDIT,
        status: WalletHistoryStatus.ON_HOLD,
        amount: bookingProps.grandTotal,
        bookingCode: bookingProps.code,
      }),
    );

    const result: Result<WalletEntity, Error> = await this.commandBus.execute(
      new UpdateWalletCommand({
        artisanID,
        currentBalance,
        onHold,
        ready: wallet.ready,
        histories,
      }),
    );
  }
}
