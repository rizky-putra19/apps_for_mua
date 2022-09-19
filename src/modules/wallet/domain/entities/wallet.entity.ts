import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { WalletOrmEntity } from '../../database/wallet.orm-entity';
import { WalletHistoryEntity } from './wallet-history.entity';

export interface CreateWalletProps {
  artisan?: UserEntity;
  currentBalance: number;
  onHold: number;
  ready: number;
}

export interface WalletProps extends CreateWalletProps {
  histories?: WalletHistoryEntity[];
}

export class WalletEntity implements WalletProps {
  id?: number;
  artisan?: UserEntity;
  currentBalance: number;
  onHold: number;
  ready: number;
  histories?: WalletHistoryEntity[];

  constructor(props: WalletEntity) {
    this.id = props.id;
    this.artisan = props.artisan;
    this.currentBalance = props.currentBalance;
    this.onHold = props.onHold;
    this.ready = props.ready;
    this.histories = props.histories;
  }

  static create(request: CreateWalletProps): WalletEntity {
    return new WalletEntity({
      artisan: request.artisan,
      currentBalance: request.currentBalance,
      onHold: request.onHold,
      ready: request.ready,
    });
  }

  static convertToDomainEntity(walletOrmEntity: WalletOrmEntity): WalletEntity {
    return new WalletEntity({
      id: walletOrmEntity.id,
      currentBalance: walletOrmEntity.currentBalance,
      onHold: walletOrmEntity.onHold,
      ready: walletOrmEntity.ready,
      histories: walletOrmEntity.histories?.map((h) =>
        WalletHistoryEntity.convertToDomainEntity(h),
      ),
      artisan: UserOrmMapper.convertToDomainEntity(walletOrmEntity.artisan),
    });
  }

  static convertToOrmEntity(entity: WalletEntity): WalletOrmEntity {
    const ormEntity = new WalletOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.currentBalance = entity.currentBalance;
    ormEntity.onHold = entity.onHold;
    ormEntity.ready = entity.ready;
    ormEntity.histories = entity.histories?.map((h) =>
      WalletHistoryEntity.convertToOrmEntity(h),
    );
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entity.artisan);
    return ormEntity;
  }
}
