import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GeoLocationOrmEntity } from '../../database/geo-location.orm-entity';
import { GeoLocationHistoryEntity } from './geo-location-history.entity';

export interface CreateGeoLocationProps {
  artisan?: UserEntity;
  latitude: number;
  longitude: number;
  point: string;
  histories?: GeoLocationHistoryEntity[];
}

export interface GeoLocationProps extends CreateGeoLocationProps {}

export class GeoLocationEntity implements GeoLocationProps {
  id?: number;
  artisan?: UserEntity;
  latitude: number;
  longitude: number;
  point: string;
  histories?: GeoLocationHistoryEntity[];

  constructor(props: GeoLocationEntity) {
    this.id = props.id;
    this.artisan = props.artisan;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.point = props.point;
    this.histories = props.histories;
  }

  static create(request: CreateGeoLocationProps): GeoLocationEntity {
    return new GeoLocationEntity({
      artisan: request.artisan,
      latitude: request.latitude,
      longitude: request.longitude,
      point: request.point,
      histories: request.histories,
    });
  }

  static convertToDomainEntity(ormEntity: GeoLocationOrmEntity) {
    return new GeoLocationEntity({
      id: ormEntity.id,
      artisan: UserOrmMapper.convertToDomainEntity(ormEntity.artisan),
      latitude: ormEntity.latitude,
      longitude: ormEntity.longitude,
      point: ormEntity.point,
      histories: ormEntity.histories?.map((g) =>
        GeoLocationHistoryEntity.convertToDomainEntity(g),
      ),
    });
  }

  static convertToOrmEntity(entity: GeoLocationEntity) {
    const ormEntity = new GeoLocationOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entity.artisan);
    ormEntity.latitude = entity.latitude;
    ormEntity.longitude = entity.longitude;
    ormEntity.point = entity.point;
    ormEntity.histories = entity.histories?.map((h) =>
      GeoLocationHistoryEntity.convertToOrmEntity(h),
    );
    return ormEntity;
  }
}
