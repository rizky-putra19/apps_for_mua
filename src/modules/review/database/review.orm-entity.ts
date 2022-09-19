import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class ReviewOrmEntity {
  constructor(props?: ReviewOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'review' })
  review: string;

  @Column({ name: 'rating' })
  rating: number;

  @ManyToOne((a) => UserOrmEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan: UserOrmEntity;

  @ManyToOne((c) => UserOrmEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserOrmEntity;

  @OneToOne((b) => BookingOrmEntity)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingOrmEntity;

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
