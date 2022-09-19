import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';
import { MediaEntity } from '@src/modules/media/domain/entities/media.entity';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ServiceOrmEntity } from '../../database/service.orm-entity';
import { ServiceStatus } from '../enum/service-status.enum';

export interface CreateServiceProps {
  title?: string;
  category: CategoryEntity;
  price: number;
  originalPrice: number;
  description: string;
  status: ServiceStatus;
  artisan: UserEntity;
  duration: number;
}
export interface ServiceProps extends CreateServiceProps {
  images?: MediaEntity[];
}

export class ServiceEntity extends AggregateRoot<ServiceProps> {
  protected _id: UUID;

  static create(request: CreateServiceProps): ServiceEntity {
    const id = UUID.generate();
    const serviceProps: ServiceProps = {
      category: request.category,
      description: request.description,
      duration: request.duration,
      price: request.price,
      originalPrice: request.originalPrice,
      status: request.status,
      title: request.title,
      artisan: request.artisan,
    };

    return new ServiceEntity({ id, props: serviceProps });
  }

  static convertToDomainEntity(ormEntity: ServiceOrmEntity): ServiceEntity {
    return new ServiceEntity({
      id: new UUID(ormEntity.id),
      props: {
        title: ormEntity.title,
        description: ormEntity.description,
        duration: ormEntity.duration,
        status: ormEntity.status,
        price: ormEntity.price,
        originalPrice: ormEntity.originalPrice,
        category: CategoryEntity.converToDomainEntity(ormEntity.category),
        artisan: UserOrmMapper.convertToDomainEntity(ormEntity.artisan),
      },
    });
  }

  static convertToOrmEntity(entity: ServiceEntity): ServiceOrmEntity {
    const ormEntity = new ServiceOrmEntity();
    const entityProps = entity.getPropsCopy();
    ormEntity.id = entityProps.id.value;
    ormEntity.title = entityProps.title;
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entityProps.artisan);
    ormEntity.category = CategoryEntity.convertToOrmEntity(
      entityProps.category,
    );
    ormEntity.duration = entityProps.duration;
    ormEntity.price = entityProps.price;
    ormEntity.originalPrice = entityProps.originalPrice;
    ormEntity.status = entityProps.status;
    return ormEntity;
  }
}
