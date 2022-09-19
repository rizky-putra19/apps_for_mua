import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { NotFoundException } from '@src/libs/exceptions';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../domain/entities/favorite.entity';
import { FavoriteOrmEntity } from './favorite.orm-entity';
import { FavoriteRepositoryPort } from './favorite.repository.port';

@Injectable()
export class FavoriteRepository implements FavoriteRepositoryPort {
  constructor(
    @InjectRepository(FavoriteOrmEntity)
    private readonly favoriteRepository: Repository<FavoriteOrmEntity>,
    private readonly userRepository: UserRepository,
  ) {}
  protected relations: string[] = ['artisan', 'customer'];

  async findOneByIdOrThrow(id: number): Promise<FavoriteEntity> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        id: id,
      },
      relations: this.relations,
    });
    const customer = await this.userRepository.findById(favorite.customer.id);
    const artisan = await this.userRepository.findById(favorite.artisan.id);
    favorite.artisan = UserOrmMapper.convertToOrmEntity(artisan);
    favorite.customer = UserOrmMapper.convertToOrmEntity(customer);
    if (!favorite) {
      throw new NotFoundException();
    }

    return FavoriteEntity.convertToDomainEntity(favorite);
  }

  async findListFavorite(
    customerId: string,
  ): Promise<DataAndCountMeta<FavoriteEntity[]>> {
    const [data, count] = await this.favoriteRepository.findAndCount({
      where: {
        customer: {
          id: customerId,
        },
      },
    });
    const result = {
      data: await Promise.all(
        data.map(async (f) => {
          const customer = await this.userRepository.findById(f.customer.id);
          const artisan = await this.userRepository.findById(f.artisan.id);

          f.customer = UserOrmMapper.convertToOrmEntity(customer);
          f.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          return FavoriteEntity.convertToDomainEntity(f);
        }),
      ),
      count,
    };
    return result;
  }

  async save(favoriteEntity: FavoriteEntity) {
    const ormEntity = FavoriteEntity.convertToOrmEntity(favoriteEntity);
    return this.favoriteRepository.save(ormEntity);
  }

  async delete(favoriteEntity: FavoriteEntity) {
    return await this.favoriteRepository.delete(
      FavoriteEntity.convertToOrmEntity(favoriteEntity),
    );
  }

  async exist(customerID: string, artisanID: string): Promise<boolean> {
    const found = await this.favoriteRepository.findOne({
      where: {
        customer: {
          id: customerID,
        },
        artisan: {
          id: artisanID,
        },
      },
    });

    if (found) {
      return true;
    }
    return false;
  }

  async countFavorite(artisanId: string): Promise<number> {
    const [data, count] = await this.favoriteRepository.findAndCount({
      where: {
        artisan: {
          id: artisanId,
        },
      },
    });
    return count;
  }
}
