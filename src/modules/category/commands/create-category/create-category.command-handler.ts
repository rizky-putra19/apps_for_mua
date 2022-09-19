import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { CategoryOrmEntity } from '../../database/category.orm-entity';
import { CategoryRepository } from '../../database/category.repository';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryNotFoundError } from '../../errors/category.errors';
import { CreateCategoryCommand } from './create-category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly categoryRepository: CategoryRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateCategoryCommand,
  ): Promise<Result<CategoryOrmEntity, CategoryNotFoundError>> {
    const category = await this.categoryRepository.findOneById(
      command.parentId,
    );

    if (!category && command.parentId) {
      return Result.err(new CategoryNotFoundError());
    }

    const newCategory = CategoryEntity.create({
      name: command.name,
      parent: category ? category : null,
    });

    const created = await this.categoryRepository.save(newCategory);

    return Result.ok(created);
  }
}
