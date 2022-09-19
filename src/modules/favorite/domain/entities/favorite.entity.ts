import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FavoriteOrmEntity } from '../../database/favorite.orm-entity';

export interface CreateFavoriteProps {
  id?: number;
  artisan: UserEntity;
  customer: UserEntity;
}

export interface FavoriteProps extends CreateFavoriteProps {}

export class FavoriteEntity implements FavoriteProps {
  id?: number;
  artisan: UserEntity;
  customer: UserEntity;

  constructor(props: FavoriteEntity) {
    this.id = props.id;
    this.artisan = props.artisan;
    this.customer = props.customer;
  }

  static create(request: CreateFavoriteProps): FavoriteEntity {
    const favorite = new FavoriteEntity({
      artisan: request.artisan,
      customer: request.customer,
    });
    return favorite;
  }

  static convertToDomainEntity(
    favoriteOrmEntity: FavoriteOrmEntity,
  ): FavoriteEntity {
    return new FavoriteEntity({
      id: favoriteOrmEntity.id,
      artisan: UserOrmMapper.convertToDomainEntity(favoriteOrmEntity.artisan),
      customer: UserOrmMapper.convertToDomainEntity(favoriteOrmEntity.customer),
    });
  }

  static convertToOrmEntity(entity: FavoriteEntity): FavoriteOrmEntity {
    const ormEntity = new FavoriteOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entity.artisan);
    ormEntity.customer = UserOrmMapper.convertToOrmEntity(entity.customer);
    return ormEntity;
  }
}
