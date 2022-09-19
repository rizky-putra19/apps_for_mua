import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { PaymentOrmEntity } from '@src/modules/payment/database/payment.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceStatus } from '../domain/enums/invoice-status.enum';

@Entity('invoices')
export class InvoiceOrmEntity extends TypeormEntityBase {
  @Column()
  @Index({ unique: true })
  code: string;

  @OneToOne(() => BookingOrmEntity)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingOrmEntity;

  @Column({ name: 'subtotal' })
  subtotal: number;

  @Column({ name: 'grand_total' })
  grandTotal: number;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan: UserOrmEntity;

  @OneToOne(() => PaymentOrmEntity, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: PaymentOrmEntity;
}
