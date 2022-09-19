import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletHistoryStatus } from '../domain/enums/wallet-history-status.enum';
import { WalletHistoryType } from '../domain/enums/wallet-history-type.enum';
import { WalletOrmEntity } from './wallet.orm-entity';

@Entity('wallet_history')
@Index('idx_fulltext', ['bookingCode', 'description'], { fulltext: true })
export class WalletHistoryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    enum: WalletHistoryType,
    type: 'enum',
  })
  type: WalletHistoryType;

  @Column({
    enum: WalletHistoryStatus,
    type: 'enum',
  })
  status: WalletHistoryStatus;

  @Column()
  amount: number;

  @Column({
    name: 'booking_code',
  })
  bookingCode: string;

  @ManyToOne(() => WalletOrmEntity)
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletOrmEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    update: false,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt?: Date;
}
