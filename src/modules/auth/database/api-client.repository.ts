import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { QueryParams } from '@src/libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import {
  ApiClientEntity,
  ApiClientProps,
} from '../domain/entities/api-client.entity';
import { ApiClientOrmEntity } from './api-client-orm-entity';
import { ApiClientOrmMapper } from './api-client.orm-mapper';
import { ApiClientRepositoryPort } from './api-client.repository.port';

@Injectable()
export class ApiClientRepository
  extends TypeormRepositoryBase<
    ApiClientEntity,
    ApiClientProps,
    ApiClientOrmEntity
  >
  implements ApiClientRepositoryPort
{
  constructor(
    @InjectRepository(ApiClientOrmEntity)
    readonly apiClientRepository: Repository<ApiClientOrmEntity>,
  ) {
    super(
      apiClientRepository,
      new ApiClientOrmMapper(ApiClientEntity, ApiClientOrmEntity),
      new Logger('ApiClientRepository'),
    );
  }
  protected relations: string[];

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & ApiClientProps>,
  ): WhereCondition<ApiClientOrmEntity> {
    const where: QueryParams<ApiClientOrmEntity> = {};
    return where;
  }
}
