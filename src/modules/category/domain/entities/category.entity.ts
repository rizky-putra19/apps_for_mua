import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { CategoryStatus } from '../enums/category-status.enum';

export interface CreatedCategoryProps {
  id?: number;
  name: string;
  parent?: CategoryEntity;
}

export interface CategoryProps extends CreatedCategoryProps {
  status?: CategoryStatus;
  icon?: MediaOrmEntity;
}

export class CategoryEntity implements CategoryProps {
  id?: number;
  name: string;
  parent?: CategoryEntity;
  status?: CategoryStatus;
  icon?: MediaOrmEntity;

  constructor(props: CategoryEntity) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
    this.parent = props.parent;
    this.icon = props.icon;
  }

  static create(request: CategoryProps): CategoryEntity {
    const category = new CategoryEntity({
      name: request.name,
      parent: request.parent,
      status: request.status,
    });

    return category;
  }

  static update(request: CategoryProps): CategoryEntity {
    const category = new CategoryEntity({
      name: request.name,
      parent: request.parent,
      id: request.id,
      status: request.status,
    });
    return request;
  }

  static convertToOrmEntity(categoryEntity: CategoryEntity) {
    const categoryOrmEntity = new CategoryOrmEntity();
    categoryOrmEntity.id = categoryEntity.id;
    categoryOrmEntity.name = categoryEntity.name;
    categoryOrmEntity.status = categoryEntity.status;
    categoryOrmEntity.icon = categoryEntity.icon;
    categoryOrmEntity.parent =
      categoryEntity.parent != null
        ? CategoryEntity.convertToOrmEntity(categoryOrmEntity.parent)
        : null;

    return categoryOrmEntity;
  }

  static converToDomainEntity(ormEntity: CategoryOrmEntity) {
    return new CategoryEntity({
      id: ormEntity.id,
      name: ormEntity.name,
      status: ormEntity.status,
      icon: ormEntity.icon,
      parent:
        ormEntity.parent != null
          ? CategoryEntity.converToDomainEntity(ormEntity.parent)
          : null,
    });
  }
}
