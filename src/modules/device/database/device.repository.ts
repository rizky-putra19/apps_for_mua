import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import { DeviceEntity, DeviceProps } from '../domain/entities/device.entity';
import { DeviceOrmEntity } from './device.orm-entity';
import { DeviceOrmMapper } from './device.orm-mapper';

export class DeviceRepository extends TypeormRepositoryBase<
  DeviceEntity,
  DeviceProps,
  DeviceOrmEntity
> {
  constructor(
    @InjectRepository(DeviceOrmEntity)
    readonly deviceRepository: Repository<DeviceOrmEntity>,
  ) {
    super(
      deviceRepository,
      new DeviceOrmMapper(DeviceEntity, DeviceOrmEntity),
      new Logger('DeviceRepository'),
    );
  }
  protected relations: string[];

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & DeviceProps>,
  ): WhereCondition<DeviceOrmEntity> {
    const where: WhereCondition<DeviceOrmEntity> = {};
    if (params.deviceId) {
      where.deviceId = params.deviceId;
    }
    if (params.type) {
      where.type = params.type;
    }
    return where;
  }
}
