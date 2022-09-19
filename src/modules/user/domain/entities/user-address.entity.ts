import { UserAddressOrmEntity } from '../../database/user-addresses.orm-entity';
import { UserOrmMapper } from '../../database/user.orm-mapper';
import { UserEntity } from './user.entity';

export interface CreateUserAddressProps {
  readonly name: string;
  readonly address: string;
  readonly notes: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly user: UserEntity;
  readonly extra?: { [key: string]: any };
}
export interface UserAddressProps extends CreateUserAddressProps {}
export class UserAddressEntity implements UserAddressProps {
  id?: number;
  name: string;
  address: string;
  notes: string;
  latitude: number;
  longitude: number;
  extra?: { [key: string]: any };
  user: UserEntity;
  constructor(props: UserAddressEntity) {
    this.id = props.id;
    this.name = props.name;
    this.address = props.address;
    this.notes = props.notes;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.extra = props.extra;
    this.user = props.user;
  }

  static create(request: CreateUserAddressProps): UserAddressEntity {
    return new UserAddressEntity({
      name: request.name,
      address: request.address,
      notes: request.notes,
      latitude: request.latitude,
      longitude: request.longitude,
      extra: request.extra,
      user: request.user,
    });
  }

  static convertToDomainEntity(
    userAddressOrmEntity: UserAddressOrmEntity,
  ): UserAddressEntity {
    return new UserAddressEntity({
      id: userAddressOrmEntity.id,
      name: userAddressOrmEntity.name,
      address: userAddressOrmEntity.address,
      notes: userAddressOrmEntity.notes,
      latitude: userAddressOrmEntity.latitude,
      longitude: userAddressOrmEntity.longitude,
      user: UserOrmMapper.convertToDomainEntity(userAddressOrmEntity.user),
      extra: userAddressOrmEntity.extra,
    });
  }
}
