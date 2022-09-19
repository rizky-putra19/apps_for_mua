import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { MediaOrmMapper } from '@src/modules/media/database/media.orm-mapper';
import { ReasonEntity } from '@src/modules/reasons/domain/entities/reason.entity';
import {
  ReportIssueEntity,
  ReportIssueProps,
} from '../domain/entities/report-issue.entity';
import { ReportIssueOrmEntity } from './report-issue.orm-entity';

export class ReportIssueOrmMapper extends OrmMapper<
  ReportIssueEntity,
  ReportIssueOrmEntity
> {
  protected toDomainProps(
    ormEntity: ReportIssueOrmEntity,
  ): EntityProps<ReportIssueProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        note: ormEntity.note,
        reportIssueStatus: ormEntity.reportIssueStatus,
        booking: BookingOrmMapper.toDomainEntity(ormEntity.booking),
        reason: ReasonEntity.convertToDomainEntity(ormEntity.reason),
        mediaIssue: ormEntity.mediaIssue?.map((m) =>
          MediaOrmMapper.convertToDomainEntity(m),
        ),
      },
    };
  }
  protected toOrmProps(
    entity: ReportIssueEntity,
  ): OrmEntityProps<ReportIssueOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      note: props.note,
      reportIssueStatus: props.reportIssueStatus,
      booking: BookingOrmMapper.toOrmEntity(props.booking),
      reason: ReasonEntity.convertToOrmEntity(props.reason),
    };
  }

  static toDomainEntity(ormEntity: ReportIssueOrmEntity): ReportIssueEntity {
    if (ormEntity != undefined) {
      const mapper = new ReportIssueOrmMapper(
        ReportIssueEntity,
        ReportIssueOrmEntity,
      );
      return mapper.toDomainEntity(ormEntity);
    }
  }

  static toOrmEntity(entity: ReportIssueEntity): ReportIssueOrmEntity {
    const mapper = new ReportIssueOrmMapper(
      ReportIssueEntity,
      ReportIssueOrmEntity,
    );
    return mapper.toOrmEntity(entity);
  }
}
