import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GeoLocationHistoryOrmEntity } from '../../database/geo-location-history.orm-entity';
import { GeoLocationEntity } from './geo-location.entity';

export class GeoLocationHistoryEntity {
  id?: number;
  latitude: number;
  longitude: number;
  point: string;
  geoLocation?: GeoLocationEntity;

  constructor(props: GeoLocationHistoryEntity) {
    this.id = props.id;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.point = props.point;
  }

  static convertToDomainEntity(ormEntity: GeoLocationHistoryOrmEntity) {
    return new GeoLocationHistoryEntity({
      id: ormEntity.id,
      latitude: ormEntity.latitude,
      longitude: ormEntity.longitude,
      point: ormEntity.point,
    });
  }

  static convertToOrmEntity(entity: GeoLocationHistoryEntity) {
    const ormEntity = new GeoLocationHistoryOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.latitude = entity.latitude;
    ormEntity.longitude = entity.longitude;
    ormEntity.point = entity.point;
    return ormEntity;
  }
}
