import { WalletHistoryOrmEntity } from '../../database/wallet-history.orm-entity';
import { WalletHistoryStatus } from '../enums/wallet-history-status.enum';
import { WalletHistoryType } from '../enums/wallet-history-type.enum';
import { WalletEntity } from './wallet.entity';

export class WalletHistoryEntity {
  id?: number;
  title: string;
  description: string;
  type: WalletHistoryType;
  status: WalletHistoryStatus;
  amount: number;
  bookingCode: string;
  wallet?: WalletEntity;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: WalletHistoryEntity) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.type = props.type;
    this.status = props.status;
    this.amount = props.amount;
    this.bookingCode = props.bookingCode;
    this.wallet = props.wallet;
  }

  static convertToDomainEntity(ormEntity: WalletHistoryOrmEntity) {
    return new WalletHistoryEntity({
      id: ormEntity.id,
      title: ormEntity.title,
      description: ormEntity.description,
      type: ormEntity.type,
      status: ormEntity.status,
      amount: ormEntity.amount,
      bookingCode: ormEntity.bookingCode,
    });
  }

  static convertToOrmEntity(entity: WalletHistoryEntity) {
    const ormEntity = new WalletHistoryOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.title = entity.title;
    ormEntity.description = entity.description;
    ormEntity.type = entity.type;
    ormEntity.status = entity.status;
    ormEntity.amount = entity.amount;
    ormEntity.bookingCode = entity.bookingCode;
    return ormEntity;
  }

  // only user for wallet history response
  static domainEntityForWalletHistory(ormEntity: WalletHistoryOrmEntity) {
    return new WalletHistoryEntity({
      id: ormEntity.id,
      title: ormEntity.title,
      description: ormEntity.description,
      type: ormEntity.type,
      status: ormEntity.status,
      amount: ormEntity.amount,
      bookingCode: ormEntity.bookingCode,
      wallet: WalletEntity.convertToDomainEntity(ormEntity.wallet),
    });
  }
}
