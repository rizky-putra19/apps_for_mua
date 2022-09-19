import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { MediaEntity } from '@src/modules/media/domain/entities/media.entity';
import { ReasonEntity } from '@src/modules/reasons/domain/entities/reason.entity';
import { ReportIssueStatus } from '../enums/report-issue-status.enum';
import { ReportIssueCreatedEvent } from '../events/report-issue-created.event';

export interface CreateReportIssueProps {
  note: string;
  reportIssueStatus: ReportIssueStatus;
  booking?: BookingEntity;
  reason?: ReasonEntity;
}

export interface ReportIssueProps extends CreateReportIssueProps {
  mediaIssue?: MediaEntity[];
}

export class ReportIssueEntity extends AggregateRoot<ReportIssueProps> {
  protected _id: ID;

  static create(request: CreateReportIssueProps): ReportIssueEntity {
    const reportIssueId = UUID.generate();
    const reportIssueEntity = new ReportIssueEntity({
      id: reportIssueId,
      props: {
        note: request.note,
        reportIssueStatus: request.reportIssueStatus,
        booking: request.booking,
        reason: request.reason,
      },
    });
    reportIssueEntity.addEvent(
      new ReportIssueCreatedEvent({
        bookingId: request.booking.id.value,
        aggregateId: request.booking.id.value,
      }),
    );

    return reportIssueEntity;
  }
}
