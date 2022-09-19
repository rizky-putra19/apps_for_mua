import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import {
  DataAndCountMeta,
  DataWithPaginationMeta,
  FindManyPaginatedParams,
} from '@src/libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { MediaRepository } from '@src/modules/media/database/media.repository';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Brackets, Repository } from 'typeorm';
import { ServiceEntity, ServiceProps } from '../domain/entities/service.entity';
import { ServiceOrmMapper } from './service-orm-mapper';
import { ServiceOrmEntity } from './service.orm-entity';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { CategoryRepository } from '@src/modules/category/database/category.repository';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';

export class ServiceRepository extends TypeormRepositoryBase<
  ServiceEntity,
  ServiceProps,
  ServiceOrmEntity
> {
  protected relations: string[] = ['artisan', 'category'];

  constructor(
    @InjectRepository(ServiceOrmEntity)
    readonly serviceRepository: Repository<ServiceOrmEntity>,
    readonly userRepository: UserRepository,
    readonly mediaRepository: MediaRepository,
    readonly categoryRepository: CategoryRepository,
  ) {
    super(
      serviceRepository,
      new ServiceOrmMapper(ServiceEntity, ServiceOrmEntity),
      new Logger('ServiceRepository'),
    );
  }

  async exist(userId: string, categoryId: number): Promise<boolean> {
    const service = await this.repository.findOne({
      where: {
        artisan: {
          id: userId,
        },
        category: {
          id: categoryId,
        },
      },
    });
    if (!service) {
      return false;
    }
    return true;
  }

  async findOneServiceById(id: string | ID): Promise<ServiceEntity> {
    const service = await this.repository.findOneOrFail(
      {
        id: id instanceof ID ? id.value : id,
      },
      { relations: this.relations },
    );

    const artisan = await this.userRepository.findById(service.artisan.id);
    const images = await this.mediaRepository.getAllMediaByTypeAndTypeId(
      service.id.toString(),
      'service-image',
    );
    service.artisan = UserOrmMapper.convertToOrmEntity(artisan);
    service.images = images;

    return this.mapper.toDomainEntity(service);
  }

  async findManyPaginated({
    where,
    pagination,
    order,
  }: FindManyPaginatedParams<ServiceOrmEntity>): Promise<
    DataWithPaginationMeta<ServiceEntity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where,
      order,
      relations: this.relations,
    });
    const result: DataWithPaginationMeta<ServiceEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const artisan = await this.userRepository.findById(item.artisan.id);
          const images = await this.mediaRepository.getAllMediaByTypeAndTypeId(
            item.id.toString(),
            'service-image',
          );
          const categoryTree =
            await this.categoryRepository.findTreeFromChildId(item.category.id);
          item.images = images;
          item.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          item.category = categoryTree;

          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };
    return result;
  }

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & ServiceProps>,
  ): WhereCondition<ServiceOrmEntity> {
    throw new Error('Method not implemented.');
  }
}
