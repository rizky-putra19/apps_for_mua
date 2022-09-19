import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { QueryParams } from '@src/libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import { OtpEntity, OtpProps } from '../domain/entities/otp.entity';
import { OtpOrmEntity } from './otp.orm-entity';
import { OtpOrmMapper } from './otp.orm-mapper';

export class OtpRepository extends TypeormRepositoryBase<
  OtpEntity,
  OtpProps,
  OtpOrmEntity
> {
  constructor(
    @InjectRepository(OtpOrmEntity)
    readonly otpRepository: Repository<OtpOrmEntity>,
  ) {
    super(
      otpRepository,
      new OtpOrmMapper(OtpEntity, OtpOrmEntity),
      new Logger('OtpRepository'),
    );
  }
  protected relations: string[];
  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & OtpProps>,
  ): WhereCondition<OtpOrmEntity> {
    const where: QueryParams<OtpOrmEntity> = {};
    if (params.secret) {
      where.secret = params.secret;
    }
    if (params.identifier) {
      where.identifier = params.identifier;
    }

    return where;
  }
}
