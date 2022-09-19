import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { CategoryRepository } from '@src/modules/category/database/category.repository';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';
import { ServiceRepository } from '../../database/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceStatus } from '../../domain/enum/service-status.enum';
import { ServiceAlreadyExist } from '../../errors/service.errors';
import { CreateServiceCommand } from './create-service.command';

@CommandHandler(CreateServiceCommand)
export class CreateServiceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly serviceRepository: ServiceRepository,
    protected readonly categoryRepository: CategoryRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateServiceCommand,
  ): Promise<Result<ServiceEntity, Error>> {
    try {
      const { user, service } = command;
      const exist = await this.serviceRepository.exist(
        user.id.value,
        service.category,
      );
      if (exist) {
        throw new ServiceAlreadyExist();
      }

      const category = CategoryEntity.convertToOrmEntity(
        await this.categoryRepository.findOneById(service.category),
      );
      const categoryEntity = CategoryEntity.converToDomainEntity(category);

      const serviceEntity = ServiceEntity.create({
        title: !service.title ? null : service.title,
        description: service.description,
        status: ServiceStatus.ACTIVE,
        category: categoryEntity,
        artisan: user,
        duration: service.duration,
        price: service.price != null ? service.price : service.originalPrice,
        originalPrice: service.originalPrice,
      });

      const created = await this.serviceRepository.save(serviceEntity);

      return Result.ok(created);
    } catch (error) {
      return Result.err(error);
    }
  }
}
