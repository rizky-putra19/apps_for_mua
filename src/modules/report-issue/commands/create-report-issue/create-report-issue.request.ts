import { Expose } from 'class-transformer';

export class CreateReportIssueRequest {
  note: string;
  @Expose({ name: 'booking_id' })
  bookingId: string;
  @Expose({ name: 'reason_id' })
  reasonId: number;
}
