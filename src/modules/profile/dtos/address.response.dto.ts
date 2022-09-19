import { UserAddressEntity } from '@src/modules/user/domain/entities/user-address.entity';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';

export class AddressResponse {
  id: number;
  name: string;
  address: string;
  notes: string;
  latitude: number;
  longitude: number;
  user: string;
  extra?: { [key: string]: any };
  constructor(entity: UserAddressEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.address = entity.address;
    this.notes = entity.notes;
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
    this.user = entity.user.id.value;
    this.extra = entity.extra;
  }
}
