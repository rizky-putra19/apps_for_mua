import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '../category/database/category.repository';
import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import { CreateServiceCommandHandler } from './commands/create-service/create-service.command-handler';
import { CreateServiceHttpController } from './commands/create-service/create-service.http-controller';
import { DeleteServiceCommandHandler } from './commands/delete-service/delete-service.command-handler';
import { DeleteServiceHttpController } from './commands/delete-service/delete-service.http.controller';
import { UpdateServiceCommandHandler } from './commands/update-service/update-service.command-handler';
import { UpdateServiceHttpController } from './commands/update-service/update-service.http-controller';
import { ServiceOrmEntity } from './database/service.orm-entity';
import { ServiceRepository } from './database/service.repository';
import { FindServiceHttpController } from './queries/find-service/find-service.http-controller';
import { FindServiceQueryHandler } from './queries/find-service/find-service.query-handler';
import { GetServiceHttpController } from './queries/get-service/get-service.http.controller';
import { GetServiceQueryHandler } from './queries/get-service/get-service.query-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrmEntity]),
    CqrsModule,
    UserModule,
    MediaModule,
  ],
  providers: [
    GetServiceQueryHandler,
    ServiceRepository,
    CategoryRepository,
    FindServiceQueryHandler,
    CreateServiceCommandHandler,
    UpdateServiceCommandHandler,
    DeleteServiceCommandHandler,
  ],
  controllers: [
    FindServiceHttpController,
    GetServiceHttpController,
    CreateServiceHttpController,
    UpdateServiceHttpController,
    DeleteServiceHttpController,
  ],
})
export class ServiceModule {}
