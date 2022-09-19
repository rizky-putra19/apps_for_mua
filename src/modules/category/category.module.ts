import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCreateCategoryHttpController } from './commands/create-category/admin-create-category.http.controller';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category.command-handler';
import { CategoryOrmEntity } from './database/category.orm-entity';
import { CategoryRepository } from './database/category.repository';
import { GetCategoryController } from './queries/get-categories/get-categories.http.controller';
import { GetCategoriesQueryHandler } from './queries/get-categories/get-categories.query-handler';
import { HttpModule } from '@nestjs/axios';
import { AdminGetCategoryController } from './queries/get-categories/admin-get-categories.http.controller';
import { AdminUpdateCategoryHttpController } from './commands/update-category/admin-update-category.http.controller';
import { UpdateCategoryCommandHandler } from './commands/update-category/update-category.command-handler';
import { AdminUpdateCategoryStatusHttpController } from './commands/update-category/admin-update-category-status.http.controller';
import { UpdateCategoryStatusCommandHandler } from './commands/update-category/update-category-status.command-handler';
import { MediaModule } from '../media/media.module';
import { MediaRepository } from '../media/database/media.repository';

const httpControllers = [
  GetCategoryController,
  AdminCreateCategoryHttpController,
  AdminGetCategoryController,
  AdminUpdateCategoryHttpController,
  AdminUpdateCategoryStatusHttpController,
];

const commandHandlers = [
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  UpdateCategoryStatusCommandHandler,
];

const queryHandlers = [GetCategoriesQueryHandler];

const repositories = [CategoryRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryOrmEntity]),
    CqrsModule,
    HttpModule,
    MediaModule,
  ],
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...queryHandlers, CategoryRepository],
})
export class CategoryModule {}
