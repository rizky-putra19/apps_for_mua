import { TypeormEntityBase } from '../../../libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingOrmEntity } from './booking.orm-entity';
import { ServiceOrmEntity } from '@src/modules/service/database/service.orm-entity';

@Entity('booking_services')
export class BookingServiceOrmEntity extends TypeormEntityBase {
  @Column()
  title: string;

  @Column()
  quantity: number;

  @Column({
    precision: 16,
    scale: 2,
    type: 'decimal',
    nullable: true,
  })
  total: number;

  @Column({
    precision: 16,
    scale: 2,
    type: 'decimal',
    nullable: true,
  })
  price?: number;

  @Column({ name: 'notes', nullable: true })
  notes?: string;

  @ManyToOne(() => ServiceOrmEntity)
  @JoinColumn({ name: 'service_id' })
  service: ServiceOrmEntity;

  @ManyToOne(() => BookingOrmEntity, (booking) => booking.services, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking: BookingOrmEntity;

  constructor(props?: BookingServiceOrmEntity) {
    super(props);
  }
}
