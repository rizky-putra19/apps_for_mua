import { OneToMany } from 'typeorm';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookingStatus } from '../domain/enums/booking-status.enum';
import { BookingOrmEntity } from './booking.orm-entity';

@Entity('booking_status')
export class BookingStatusOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ nullable: true })
  description?: string;
  @Column({ name: 'status', enum: BookingStatus, type: 'enum' })
  status: BookingStatus;
}
