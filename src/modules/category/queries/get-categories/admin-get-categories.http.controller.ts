import { Result } from '@badrap/result';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { GetCategoriesQuery } from './get-categories.query';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';

@Controller({
  version: routesApiV1.version,
  path: '/admin/categories',
})
export class AdminGetCategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async categories() {
    const result: Result<CategoryOrmEntity[]> = await this.queryBus.execute(
      new GetCategoriesQuery(),
    );

    return new DataResponseBase(result.unwrap());
  }
}
