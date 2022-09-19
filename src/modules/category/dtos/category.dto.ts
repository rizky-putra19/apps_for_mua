import { Expose } from 'class-transformer';
import { CategoryOrmEntity } from '../database/category.orm-entity';
import { CategoryEntity } from '../domain/entities/category.entity';
import { CategoryStatus } from '../domain/enums/category-status.enum';

export class CategoryResponse {
  id: number;
  name: string;
  childrens: CategoryEntity[];
  status: CategoryStatus;
  @Expose({ name: 'icon_url' })
  iconUrl?: string;
  constructor(entity: CategoryOrmEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.childrens = entity.childrens?.map((c) => new CategoryResponse(c));
    this.status = entity.status;
    this.iconUrl = entity?.icon?.url;
  }
}

export class CategoryTreeResponse {
  id: number;
  name: string;
  status: CategoryStatus;
  @Expose({ name: 'icon_url' })
  iconUrl?: string;
  parent?: CategoryTreeResponse;
  constructor(entity: CategoryEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.status = entity.status;
    this.iconUrl = entity?.icon?.url;
    this.parent =
      entity.parent != null ? new CategoryTreeResponse(entity?.parent) : null;
  }
}
