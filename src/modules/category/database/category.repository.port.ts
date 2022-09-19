import { CategoryEntity } from '../domain/entities/category.entity';

export interface CategoryRepositoryPort {
  findOneById(parentId: number): Promise<CategoryEntity>;
  exists(parentId: number): Promise<boolean>;
  getCategoryTree(parentId?: number): Promise<CategoryEntity[]>;
}
