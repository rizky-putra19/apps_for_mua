import { BookingStatusOrmEntity } from '../../database/booking-status.orm-entity';
import { BookingStatus } from '../enums/booking-status.enum';

export class BookingStatusEntity {
  id?: number;
  title: string;
  description?: string;
  status: BookingStatus;

  constructor(props: BookingStatusEntity) {
    this.id = props.id;
    this.description = props.description;
    this.title = props.title;
    this.status = props.status;
  }

  static convertToDomainEntity(ormEntity: BookingStatusOrmEntity) {
    if (ormEntity) {
      return new BookingStatusEntity({
        id: ormEntity.id,
        description: ormEntity.description,
        title: ormEntity.title,
        status: ormEntity.status,
      });
    }
  }
}
