import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import {
  DataWithPaginationMeta,
  FindManyPaginatedParams,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { MediaRepository } from '@src/modules/media/database/media.repository';
import { ReasonRepository } from '@src/modules/reasons/database/reason.repository';
import { ReasonEntity } from '@src/modules/reasons/domain/entities/reason.entity';
import { Repository } from 'typeorm';
import {
  ReportIssueEntity,
  ReportIssueProps,
} from '../domain/entities/report-issue.entity';
import { ReportIssueOrmEntity } from './report-issue.orm-entity';
import { ReportIssueOrmMapper } from './report-issue.orm-mapper';

export class ReportIssueRepository extends TypeormRepositoryBase<
  ReportIssueEntity,
  ReportIssueProps,
  ReportIssueOrmEntity
> {
  protected relations: string[];

  constructor(
    @InjectRepository(ReportIssueOrmEntity)
    readonly reportIssueRepository: Repository<ReportIssueOrmEntity>,
    readonly reasonRepository: ReasonRepository,
    readonly bookingRepository: BookingRepository,
    readonly mediaRepository: MediaRepository,
  ) {
    super(
      reportIssueRepository,
      new ReportIssueOrmMapper(ReportIssueEntity, ReportIssueOrmEntity),
      new Logger('ReportIssueRepository'),
    );
  }

  async findOneByIdOrThrow(id: string | ID): Promise<ReportIssueEntity> {
    const entity = await this.repository.findOne(
      {
        id: id instanceof ID ? id.value : id,
      },
      { relations: this.relations },
    );
    const reason = await this.reasonRepository.findById(entity.reason.id);
    const booking = await this.bookingRepository.findOneByIdOrThrow(
      entity.booking.id,
    );
    const mediaIssue = await this.mediaRepository.getAllMediaByTypeAndTypeId(
      entity.id.toString(),
      'media-issue',
    );
    entity.reason = ReasonEntity.convertToOrmEntity(reason);
    entity.booking = BookingOrmMapper.toOrmEntity(booking);
    entity.mediaIssue = mediaIssue;
    return this.mapper.toDomainEntity(entity);
  }

  async findManyPaginated({
    where,
    pagination,
    order,
  }: FindManyPaginatedParams<ReportIssueOrmEntity>): Promise<
    DataWithPaginationMeta<ReportIssueEntity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where,
      order,
      relations: this.relations,
    });
    const result: DataWithPaginationMeta<ReportIssueEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const reason = await this.reasonRepository.findById(item.reason.id);
          const booking = await this.bookingRepository.findOneByIdOrThrow(
            item.booking.id,
          );
          const mediaIssue =
            await this.mediaRepository.getAllMediaByTypeAndTypeId(
              item.id.toString(),
              'media-issue',
            );

          item.reason = ReasonEntity.convertToOrmEntity(reason);
          item.booking = BookingOrmMapper.toOrmEntity(booking);
          item.mediaIssue = mediaIssue;
          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & ReportIssueProps>,
  ): WhereCondition<ReportIssueOrmEntity> {
    throw new Error('Method not implemented.');
  }
}
