import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Repository } from 'typeorm';
import { GeoLocationEntity } from '../domain/entities/geo-location.entity';
import { GeoLocationHistoryOrmEntity } from './geo-location-history.orm-entity';
import { GeoLocationOrmEntity } from './geo-location.orm-entity';

@Injectable()
export class GeoLocationRepository {
  constructor(
    @InjectRepository(GeoLocationOrmEntity)
    private readonly geoLocationRepository: Repository<GeoLocationOrmEntity>,
    @InjectRepository(GeoLocationHistoryOrmEntity)
    private readonly geoLocationHistoryRepository: Repository<GeoLocationHistoryOrmEntity>,
    readonly userRepository: UserRepository,
  ) {}

  async save(entity: GeoLocationEntity) {
    const ormEntity = GeoLocationEntity.convertToOrmEntity(entity);
    return await this.geoLocationRepository.save(ormEntity);
  }

  async exist(artisanID: string): Promise<boolean> {
    const exist = await this.geoLocationRepository.findOne({
      where: {
        artisan: {
          id: artisanID,
        },
      },
    });
    if (!exist) {
      return false;
    }
    return true;
  }

  async findOneByArtisanId(artisanID: string): Promise<GeoLocationEntity> {
    const entity = await this.geoLocationRepository.findOne({
      where: {
        artisan: {
          id: artisanID,
        },
      },
      relations: ['histories', 'artisan'],
    });

    return GeoLocationEntity.convertToDomainEntity(entity);
  }

  async findNearbyArtisan({
    geoLocation,
  }): Promise<DataAndCountMeta<GeoLocationEntity[]>> {
    const qb = this.geoLocationRepository
      .createQueryBuilder('geo_locations')
      .leftJoinAndSelect('geo_locations.artisan', 'users')
      .addSelect(
        `ST_Distance(geo_locations.point, GeomFromText('POINT(${geoLocation.latitude} ${geoLocation.longitude})'))* 100`,
        'distance',
      )
      .where(
        `ST_Distance(geo_locations.point, GeomFromText('POINT(${geoLocation.latitude} ${geoLocation.longitude})'))* 100 < ${geoLocation.range}`,
      )
      .andWhere(
        `TIMESTAMPDIFF(HOUR, geo_locations.updatedAt, NOW()) < ${geoLocation.duration}`,
      );

    const [data, count] = await qb
      .addOrderBy('distance', 'ASC')
      .getManyAndCount();

    const result: DataAndCountMeta<GeoLocationEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const artisan = await this.userRepository.findById(item.artisan.id);

          item.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          return GeoLocationEntity.convertToDomainEntity(item);
        }),
      ),
      count,
    };

    return result;
  }
}
