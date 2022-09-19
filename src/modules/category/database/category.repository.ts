import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaRepository } from '@src/modules/media/database/media.repository';
import { IsNull, Repository } from 'typeorm';
import { CategoryEntity } from '../domain/entities/category.entity';
import { CategoryOrmEntity } from './category.orm-entity';
import { CategoryRepositoryPort } from './category.repository.port';

@Injectable()
export class CategoryRepository implements CategoryRepositoryPort {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly categoryRepository: Repository<CategoryOrmEntity>,
    private readonly mediaRepository: MediaRepository,
  ) {}
  protected relations: string[];

  async findOneById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    return category;
  }

  async findTopParent(id: number): Promise<CategoryEntity> {
    let category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (category.parent) {
      category = CategoryEntity.convertToOrmEntity(
        await this.findTopParent(category.parent.id),
      );
    }
    return category;
  }

  async findTreeFromChildId(id: number): Promise<CategoryOrmEntity> {
    let category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (category.parent) {
      category.parent.parent = CategoryEntity.convertToOrmEntity(
        await this.findTopParent(category.parent.id),
      );
      category.parent.parent.icon =
        await this.mediaRepository.getMediaByTypeAndTypeId(
          category.parent.parent.id.toString(),
          'category-icon',
        );
    }

    return category;
  }

  async save(categoryEntity: CategoryEntity) {
    return this.categoryRepository.save(categoryEntity);
  }

  async exists(id: number): Promise<boolean> {
    const found = await this.findOneById(id);
    if (found) {
      return true;
    }
    return false;
  }

  getTree(parentId?: number) {
    if (parentId) {
      return this.findByParentId(parentId);
    }
    return this.findByParentIdNull();
  }

  async getCategoryTree(parentId?: number): Promise<CategoryEntity[]> {
    return this.getTree(parentId);
  }
  async findByParentIdNull(): Promise<CategoryEntity[]> {
    return this.categoryRepository
      .find({
        where: {
          parent: {
            id: IsNull(),
          },
        },
        relations: ['parent'],
      })
      .then((res) => this.mapIcon(res))
      .then((res) => this.mapChildren(res));
  }

  async findByParentId(parentId: number): Promise<CategoryOrmEntity[]> {
    return this.categoryRepository
      .find({
        relations: ['parent'],
        where: {
          parent: { id: parentId },
        },
        order: {
          ordering: 'ASC',
        },
      })
      .then((res) => this.mapIcon(res))
      .then((res) => this.mapChildren(res));
  }

  async mapIcon(ormEntity: CategoryOrmEntity[]) {
    return Promise.all(
      ormEntity.map(async (category) => {
        const icon = await this.mediaRepository.getMediaByTypeAndTypeId(
          category.id.toString(),
          'category-icon',
        );
        category.icon = icon;
        return category;
      }),
    );
  }

  async mapChildren(
    ormEntity: CategoryOrmEntity[],
  ): Promise<CategoryOrmEntity[]> {
    return Promise.all(
      ormEntity.map(async (category) => {
        const cat = await this.findByParentId(category.id);
        category.childrens = cat;
        return category;
      }),
    );
  }
}
