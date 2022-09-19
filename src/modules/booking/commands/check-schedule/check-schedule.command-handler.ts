import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { BadRequestException } from '@src/libs/exceptions';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { CheckScheduleCommand } from './check-schedule.command';

@CommandHandler(CheckScheduleCommand)
export class CheckScheduleCommandHandler extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    command: CheckScheduleCommand,
  ): Promise<Result<DataAndCountMeta<BookingEntity[]>>> {
    try {
      const { artisanId, month, user } = command;
      if (user.getPropsCopy().type == 'artisan') {
        throw new BadRequestException('not authorized');
      }
      const bookingRepository = this.unitOfWork.getBookingRepository(
        command.correlationId,
      );

      const schedule = await bookingRepository.checkArtisanSchedule(
        artisanId,
        month,
      );

      return Result.ok(schedule);
    } catch (error) {
      return Result.err(error);
    }
  }
}
