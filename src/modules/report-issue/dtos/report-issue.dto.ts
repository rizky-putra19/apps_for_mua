import { ResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/response.base';
import { BookingResponse } from '@src/modules/booking/dtos/booking.dto';
import { ReasonResponse } from '@src/modules/reasons/dtos/reason.dto';
import { Expose } from 'class-transformer';
import { ReportIssueEntity } from '../domain/entities/report-issue.entity';

export class ReportIssueResponse extends ResponseBase {
  note: string;
  @Expose({ name: 'report_issue_status' })
  reportIssueStatus: string;
  booking: BookingResponse;
  reason: ReasonResponse;
  @Expose({ name: 'media_issue' })
  mediaIssue?: string[];
  constructor(entity: ReportIssueEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.note = props.note;
    this.reportIssueStatus = props.reportIssueStatus;
    this.booking = new BookingResponse(props.booking);
    this.reason = new ReasonResponse(props.reason);
    this.mediaIssue = props.mediaIssue?.map((m) => m.getPropsCopy().url);
  }
}
