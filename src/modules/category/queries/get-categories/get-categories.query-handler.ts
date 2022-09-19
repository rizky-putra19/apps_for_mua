import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { IsNull, Repository } from 'typeorm';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { CategoryRepository } from '../../database/category.repository';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryStatus } from '../../domain/enums/category-status.enum';
import { CategoryNotFoundError } from '../../errors/category.errors';
import { GetCategoriesQuery } from './get-categories.query';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesQueryHandler extends QueryHandlerBase {
  constructor(private readonly categoryRepository: CategoryRepository) {
    super();
  }

  async handle(
    query: Query,
  ): Promise<Result<CategoryEntity[], CategoryNotFoundError>> {
    // const categories = await this.categoryRepository.find({
    //   where: { parent: IsNull(), status: CategoryStatus.ACTIVE },
    //   relations: ['childrens'],
    // });

    // //  filtered only active category
    // const filtered = [];
    // categories.forEach(function (value) {
    //   const activeSubCategory = value.childrens.filter(function (value) {
    //     return value.status == CategoryStatus.ACTIVE;
    //   });
    //   value.childrens = activeSubCategory;
    //   filtered.push(value);
    // });

    const c = await this.categoryRepository.getCategoryTree();
    return Result.ok(c);
  }
}
