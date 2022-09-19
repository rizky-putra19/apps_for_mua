import { TypeormEntityBase } from '../../../libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BookingStatus } from '../domain/enums/booking-status.enum';
import { BookingServiceOrmEntity } from './booking-service.orm-entity';
import { BookingVenueOrmEntity } from './booking-venue.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { BookingStatusOrmEntity } from './booking-status.orm-entity';
import { BookingStatusHistoryOrmEntity } from './booking-status-history.orm-entity';
import { InvoiceOrmEntity } from '@src/modules/invoice/database/invoice.orm-entity';

@Entity('bookings')
@Index('idx_fulltext', ['name', 'eventName'], { fulltext: true })
export class BookingOrmEntity extends TypeormEntityBase {
  @Column({ name: 'event_name' })
  eventName: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'event_date', type: 'datetime' })
  eventDate: Date;

  @ManyToOne(() => BookingStatusOrmEntity)
  @JoinColumn({ name: 'status_id' })
  status: BookingStatusOrmEntity;

  @Column({
    name: 'platform_fee',
  })
  platformFee: number;

  @Column({
    name: 'sub_total',
  })
  subTotal: number;

  @Column({
    name: 'grand_total',
  })
  grandTotal: number;

  @Column({
    name: 'process_code',
  })
  processCode: string;

  @ManyToOne((type) => UserOrmEntity)
  @JoinColumn({ name: 'artisan_id', referencedColumnName: 'id' })
  artisan?: UserOrmEntity;

  @ManyToOne((type) => UserOrmEntity)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: UserOrmEntity;

  @OneToMany((type) => BookingServiceOrmEntity, (service) => service.booking, {
    cascade: true,
  })
  services: BookingServiceOrmEntity[];

  @OneToOne(() => BookingVenueOrmEntity, (venue) => venue.booking, {
    cascade: true,
  })
  venue: BookingVenueOrmEntity;

  @OneToMany(
    () => BookingStatusHistoryOrmEntity,
    (history) => history.booking,
    { cascade: true },
  )
  histories: BookingStatusHistoryOrmEntity[];

  @OneToOne(() => InvoiceOrmEntity, (invoice) => invoice.booking, {
    cascade: true,
  })
  invoice?: InvoiceOrmEntity;

  constructor(props?: BookingOrmEntity) {
    super(props);
  }
}
