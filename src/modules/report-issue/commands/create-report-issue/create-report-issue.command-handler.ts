import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { ReasonRepository } from '@src/modules/reasons/database/reason.repository';
import { ReportIssueRepository } from '../../database/report-issue.repository';
import { ReportIssueEntity } from '../../domain/entities/report-issue.entity';
import { ReportIssueStatus } from '../../domain/enums/report-issue-status.enum';
import { CreateReportIssueCommand } from './create-report-issue.command';

@CommandHandler(CreateReportIssueCommand)
export class CreateReportIssueCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly reportIssueRepository: ReportIssueRepository,
    protected readonly bookingRepository: BookingRepository,
    protected readonly reasonRepository: ReasonRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateReportIssueCommand,
  ): Promise<Result<ReportIssueEntity, Error>> {
    try {
      const { user, issue } = command;
      const { note, bookingId, reasonId } = issue;
      const booking = await this.bookingRepository.findOneByIdOrThrow(
        bookingId,
      );
      const bookingProps = booking.getPropsCopy();
      const reason = await this.reasonRepository.findById(reasonId);

      if (user.getPropsCopy().type != 'customer') {
        throw new BadRequestException('only customer can report an issue');
      }

      if (bookingProps.customer.id.value != user.id.value) {
        throw new BadRequestException('different customer id');
      }

      const reportIssueEntity = ReportIssueEntity.create({
        note,
        reportIssueStatus: ReportIssueStatus.OPEN,
        booking,
        reason,
      });

      const result = await this.reportIssueRepository.save(reportIssueEntity);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
