import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BadRequestException } from '@src/libs/exceptions';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceStatus } from '../../domain/enum/service-status.enum';
import { UpdateServiceCommand } from './update-service.command';

@CommandHandler(UpdateServiceCommand)
export class UpdateServiceCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateServiceCommand,
  ): Promise<Result<ServiceEntity, Error>> {
    try {
      const serviceRepo = this.unitOfWork.getServiceRepository(
        command.correlationId,
      );
      const { serviceID, user, service } = command;
      const serviceEntity = await serviceRepo.findOneServiceById(serviceID);
      const serviceProps = serviceEntity.getPropsCopy();
      if (serviceProps.artisan.id.value != user.id.value) {
        throw new BadRequestException();
      }

      const updated = new ServiceEntity({
        id: new UUID(serviceEntity.id.value),
        props: {
          ...serviceProps,
          title: service.title != null ? service.title : serviceProps.title,
          description:
            service.description != null
              ? service.description
              : serviceProps.description,
          duration:
            service.duration != null ? service.duration : serviceProps.duration,
          price: service.price != null ? service.price : serviceProps.price,
          originalPrice:
            service.originalPrice != null
              ? service.originalPrice
              : serviceProps.originalPrice,
          status:
            service.status != null
              ? ServiceStatus[service.status.toUpperCase()]
              : ServiceStatus[serviceProps.status.toUpperCase()],
        },
      });

      const result = await serviceRepo.save(updated);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
