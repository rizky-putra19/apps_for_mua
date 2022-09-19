import {
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesApiV1 } from '@src/infrastructure/configs/app.routes';
import { Result } from '@badrap/result';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UpdateCategoryRequest } from './update-category.request.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryNotFoundError } from '../../errors/category.errors';
import { UpdateCategoryCommand } from './update-category.command';
import { UpdateCategoryStatusRequest } from './update-category-status.request.dto';
import { UpdateCategoryStatusCommand } from './update-category-status.command';

@Controller({
  version: routesApiV1.version,
  path: '/admin/categories',
})
export class AdminUpdateCategoryStatusHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCategoryStatusRequest,
  ) {
    const command = new UpdateCategoryStatusCommand({
      id: id,
      status: body.status,
    });

    const result: Result<CategoryEntity, CategoryNotFoundError> =
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
