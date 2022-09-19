import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import { ReasonOrmEntiy } from '@src/modules/reasons/database/reason.orm-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ReportIssueStatus } from '../domain/enums/report-issue-status.enum';

@Entity('report_issue')
export class ReportIssueOrmEntity extends TypeormEntityBase {
  @Column()
  note: string;

  @Column({
    name: 'report_issue_status',
    type: 'enum',
    nullable: true,
    enum: ReportIssueStatus,
  })
  reportIssueStatus: ReportIssueStatus;

  @OneToOne((type) => BookingOrmEntity)
  @JoinColumn({ name: 'booking_id', referencedColumnName: 'id' })
  booking?: BookingOrmEntity;

  @ManyToOne((type) => ReasonOrmEntiy)
  @JoinColumn({ name: 'reason_id', referencedColumnName: 'id' })
  reason?: ReasonOrmEntiy;

  mediaIssue?: MediaOrmEntity[];
}
