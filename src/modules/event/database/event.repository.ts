import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { EntityProps } from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import { EventEntity, EventProps } from '../domain/entities/event.entity';
import { EventOrmEntity } from './event.orm-entity';
import { EventOrmMapper } from './event.orm-mapper';

export class EventRepository extends TypeormRepositoryBase<
  EventEntity,
  EventProps,
  EventOrmEntity
> {
  constructor(
    @InjectRepository(EventOrmEntity)
    private readonly eventRepository: Repository<EventOrmEntity>,
  ) {
    super(
      eventRepository,
      new EventOrmMapper(EventEntity, EventOrmEntity),
      new Logger('EventRepository'),
    );
  }
  protected relations: string[] = ['participants', 'services'];
  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & EventProps>,
  ): WhereCondition<EventOrmEntity> {
    const where: WhereCondition<EventOrmEntity> = {};
    // throw new Error('Method not implemented.');

    if (params.id) {
      where.id = params.id.value;
    }
    return where;
  }
}
