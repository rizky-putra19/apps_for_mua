import { FavoriteEntity } from '../domain/entities/favorite.entity';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';

export interface FavoriteRepositoryPort {
  findListFavorite(
    customerId: string,
  ): Promise<DataAndCountMeta<FavoriteEntity[]>>;
  findOneByIdOrThrow(id: number): Promise<FavoriteEntity>;
  exist(customerID: string, artisanID: string): Promise<boolean>;
  countFavorite(artisanId: string): Promise<number>;
}
