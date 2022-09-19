import { stat } from 'fs';
import { BookingStatusHistoryOrmEntity } from '../../database/booking-status-history.orm-entity';
import { BookingOrmMapper } from '../../database/booking.orm-mapper';
import { BookingStatusEntity } from './booking-status.entity';
import { BookingEntity } from './booking.entity';

export class BookingStatusHistoryEntity {
  id?: number;
  status?: BookingStatusEntity;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  booking?: BookingEntity;

  constructor(props: BookingStatusHistoryEntity) {
    this.id = props.id;
    this.status = props.status;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static convertToDomainEntity(ormEntity: BookingStatusHistoryOrmEntity) {
    const { status } = ormEntity;
    return new BookingStatusHistoryEntity({
      id: ormEntity.id,
      notes: ormEntity.notes,
      status: new BookingStatusEntity({
        id: status?.id,
        description: status?.description,
        status: status?.status,
        title: status?.title,
      }),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }
}
