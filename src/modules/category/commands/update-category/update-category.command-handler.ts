import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { CategoryRepository } from '../../database/category.repository';
import {
  CategoryEntity,
  CategoryProps,
} from '../../domain/entities/category.entity';
import { CategoryNotFoundError } from '../../errors/category.errors';
import { UpdateCategoryCommand } from './update-category.command';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly categoryRepository: CategoryRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateCategoryCommand,
  ): Promise<Result<CategoryOrmEntity, CategoryNotFoundError>> {
    const category = await this.categoryRepository.findOneById(command.id);

    if (!category) {
      return Result.err(new CategoryNotFoundError());
    }

    const categoryParent = await this.categoryRepository.findOneById(
      command.parentId,
    );

    if (!categoryParent) {
      return Result.err(new CategoryNotFoundError());
    }

    const updateCategory = CategoryEntity.update({
      id: category.id,
      name: command.name,
      parent: categoryParent ? categoryParent : null,
      status: command.status,
    });

    const updated = await this.categoryRepository.save(updateCategory);
    return Result.ok(updated);
  }
}
