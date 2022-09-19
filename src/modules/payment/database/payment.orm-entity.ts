import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { InvoiceOrmEntity } from '@src/modules/invoice/database/invoice.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentEntity } from '../domain/entities/payment-entity';
import { PaymentStatus } from '../domain/enum/payment-status.enum';

@Entity('payments')
export class PaymentOrmEntity extends TypeormEntityBase {
  @Column()
  total: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column()
  url: string;

  @Column({ type: 'json' })
  payload: any;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod?: string;
  @Column({ name: 'bank_code', nullable: true })
  bankCode?: string;
  @Column({ name: 'payment_channel', nullable: true })
  paymentChannel?: string;

  @Column({ type: 'json', nullable: true })
  callback: any;

  @Column({ name: 'provider_id', nullable: true })
  providerId: string;

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
