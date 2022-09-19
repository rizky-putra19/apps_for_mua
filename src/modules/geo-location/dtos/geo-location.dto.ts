import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { GeoLocationEntity } from '../domain/entities/geo-location.entity';

export class GeoLocationResponse {
  id: number;
  artisan: string;
  latitude: number;
  longitude: number;
  constructor(entity: GeoLocationEntity) {
    this.id = entity.id;
    this.artisan = entity.artisan.id.value;
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
  }
}

export class GeoLocationDetailResponse {
  id: number;
  artisan: UserResponse;
  latitude: number;
  longitude: number;
  constructor(entity: GeoLocationEntity) {
    this.id = entity.id;
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
    this.artisan = new UserResponse(entity.artisan);
  }
}
