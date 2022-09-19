import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletHistoryOrmEntity } from './wallet-history.orm-entity';

@Entity('wallets')
export class WalletOrmEntity {
  constructor(props?: WalletOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((a) => UserOrmEntity, (artisan) => artisan.wallet, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'artisan_id', referencedColumnName: 'id' })
  artisan: UserOrmEntity;

  @Column({ name: 'current_balance' })
  currentBalance: number;

  @Column({ name: 'on_hold' })
  onHold: number;

  @Column()
  ready: number;

  @OneToMany(() => WalletHistoryOrmEntity, (history) => history.wallet, {
    cascade: true,
  })
  histories: WalletHistoryOrmEntity[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
