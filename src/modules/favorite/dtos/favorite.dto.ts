import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { FavoriteEntity } from '../domain/entities/favorite.entity';

export class FavoriteResponse {
  id: number;
  artisan: string;
  constructor(entity: FavoriteEntity) {
    this.id = entity.id;
    this.artisan = entity.artisan.id.value;
  }
}
