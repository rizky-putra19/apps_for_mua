import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../domain/enums/booking-status.enum';
import { BookingStatusOrmEntity } from './booking-status.orm-entity';
import { BookingOrmEntity } from './booking.orm-entity';

@Entity('booking_status_history')
export class BookingStatusHistoryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookingStatusOrmEntity)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status?: BookingStatusOrmEntity;

  @ManyToOne(() => BookingOrmEntity)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingOrmEntity;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

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
