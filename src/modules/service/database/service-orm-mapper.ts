import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';
import { MediaOrmMapper } from '@src/modules/media/database/media.orm-mapper';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { ServiceEntity, ServiceProps } from '../domain/entities/service.entity';
import { ServiceOrmEntity } from './service.orm-entity';

export class ServiceOrmMapper extends OrmMapper<
  ServiceEntity,
  ServiceOrmEntity
> {
  protected toDomainProps(
    ormEntity: ServiceOrmEntity,
  ): EntityProps<ServiceProps> {
    const category = ormEntity.category;

    return {
      id: new UUID(ormEntity.id),
      props: {
        description: ormEntity.description,
        duration: ormEntity.duration,
        price: ormEntity.price,
        originalPrice: ormEntity.originalPrice,
        status: ormEntity.status,
        title: ormEntity.title,
        artisan: UserOrmMapper.convertToDomainEntity(ormEntity.artisan),
        category: CategoryEntity.converToDomainEntity(ormEntity.category),
        images: ormEntity.images?.map((i) =>
          MediaOrmMapper.convertToDomainEntity(i),
        ),
      },
    };
  }
  protected toOrmProps(
    entity: ServiceEntity,
  ): OrmEntityProps<ServiceOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      artisan: UserOrmMapper.convertToOrmEntity(props.artisan),
      category: CategoryEntity.convertToOrmEntity(props.category),
      description: props.description,
      duration: props.duration,
      price: props.price,
      originalPrice: props.originalPrice,
      status: props.status,
      title: props.title,
    };
  }

  static convertToDomainProps(ormEntity: ServiceOrmEntity) {
    const mapper = new ServiceOrmMapper(ServiceEntity, ServiceOrmEntity);
    return mapper.toDomainEntity(ormEntity);
  }

  static convertToOrmEntity(serviceEntity: ServiceEntity): ServiceOrmEntity {
    const mapper = new ServiceOrmMapper(ServiceEntity, ServiceOrmEntity);
    return mapper.toOrmEntity(serviceEntity);
  }
}
