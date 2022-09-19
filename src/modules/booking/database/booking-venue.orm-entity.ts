import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { cp } from 'fs';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BookingOrmEntity } from './booking.orm-entity';

@Entity('booking_venues')
export class BookingVenueOrmEntity extends TypeormEntityBase {
  @Column({ name: 'venue_name' })
  venueName: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'json', nullable: true })
  extra?: { [key: string]: any };

  @OneToOne((type) => BookingOrmEntity, (booking) => booking.venue, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: BookingOrmEntity;

  constructor(props?: BookingVenueOrmEntity) {
    super(props);
  }
}
