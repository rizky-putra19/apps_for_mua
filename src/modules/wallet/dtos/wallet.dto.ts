import { Expose } from 'class-transformer';
import { WalletHistoryEntity } from '../domain/entities/wallet-history.entity';
import { WalletEntity } from '../domain/entities/wallet.entity';

export class WalletResponse {
  id: number;
  artisan: string;
  currentBalance: number;
  onHold: number;
  ready: number;
  constructor(entity: WalletEntity) {
    this.id = entity.id;
    this.artisan = entity.artisan.id.value;
    this.currentBalance = entity.currentBalance;
    this.onHold = entity.onHold;
    this.ready = entity.ready;
  }
}

export class WalletHistoryResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  type: string;
  amount: number;
  @Expose({ name: 'booking_code' })
  bookingCode: string;
  @Expose({ name: 'wallet_id' })
  walletId: number;

  constructor(entity: WalletHistoryEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.amount = entity.amount;
    this.description = entity.description;
    this.bookingCode = entity.bookingCode;
    this.status = entity.status;
    this.type = entity.type;
    this.walletId = entity.wallet.id;
  }
}
