import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BadRequestException } from '@src/libs/exceptions';
import { ServiceRepository } from '../../database/service.repository';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { DeleteServiceCommand } from './delete-service.command';

@CommandHandler(DeleteServiceCommand)
export class DeleteServiceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly serviceRepository: ServiceRepository,
  ) {
    super(unitOfWork);
  }
  async handle(command: DeleteServiceCommand): Promise<Result<ID, Error>> {
    try {
      const serviceRepo = this.unitOfWork.getServiceRepository(
        command.correlationId,
      );
      const serviceEntity = await serviceRepo.findOneServiceById(
        command.serviceID,
      );

      const serviceProps = serviceEntity.getPropsCopy();

      if (serviceProps.artisan.id.value != command.user.id.value) {
        throw new BadRequestException();
      }

      const result = await serviceRepo.delete(
        new ServiceEntity({
          id: new UUID(serviceEntity.id.value),
          props: serviceProps,
        }),
      );

      return Result.ok(result.id);
    } catch (error) {
      return Result.err(error);
    }
  }
}
