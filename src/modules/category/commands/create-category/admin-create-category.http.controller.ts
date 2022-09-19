import { Result } from '@badrap/result';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { ConflictException } from '@src/libs/exceptions';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { CategoryNotFoundError } from '../../errors/category.errors';
import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryRequest } from './create-category.request.dto';

@Controller({
  version: routesApiV1.version,
  path: '/admin/categories',
})
export class AdminCreateCategoryHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: CreateCategoryRequest) {
    const command = new CreateCategoryCommand({
      name: body.name,
      parentId: body.parentId,
    });
    const result: Result<CategoryOrmEntity, CategoryNotFoundError> =
      await this.commandBus.execute(command);

    return result.unwrap(
      (category) => new DataResponseBase(category), // if ok return an id
      (error) => {
        // if error decide what to do with it
        if (error instanceof CategoryNotFoundError)
          throw new ConflictException(error.message);
        throw error;
      },
    );
  }
}
