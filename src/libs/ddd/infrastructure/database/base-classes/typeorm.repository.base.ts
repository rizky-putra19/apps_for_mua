import {
  Brackets,
  FindConditions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { DomainEvents } from '@libs/ddd/domain/domain-events';
import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import {
  QueryParams,
  FindManyPaginatedParams,
  RepositoryPort,
  DataWithPaginationMeta,
} from '../../../domain/ports/repository.ports';
import { NotFoundException } from '../../../../exceptions';
import { OrmMapper } from './orm-mapper.base';

export const DELIMITER = ' ';
export const DOUBLE_QUOTE = '"';

export type WhereCondition<OrmEntity> =
  | FindConditions<OrmEntity>[]
  | FindConditions<OrmEntity>
  | ObjectLiteral
  | string;

export abstract class TypeormRepositoryBase<
  Entity extends AggregateRoot<unknown>,
  EntityProps,
  OrmEntity,
> implements RepositoryPort<Entity, EntityProps, OrmEntity>
{
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapper<Entity, OrmEntity>,
    protected readonly logger: Logger,
    protected readonly cacheEnable: boolean = true,
  ) {}

  protected abstract relations: string[];

  protected tableName = this.repository.metadata.tableName;

  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
  ): WhereCondition<OrmEntity>;

  async save(entity: Entity): Promise<Entity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] persisted ${entity.id.value}`,
    );
    return this.mapper.toDomainEntity(result);
  }

  async findMany(params: QueryParams<EntityProps> = {}): Promise<Entity[]> {
    const result = await this.repository.find({
      where: this.prepareQuery(params),
      relations: this.relations,
      cache: this.cacheEnable,
    });

    return result.map((item) => this.mapper.toDomainEntity(item));
  }

  async softDelete(id: ID | string) {
    await this.repository.softDelete(id instanceof ID ? id.value : id);
    return id;
  }

  async findOneRaw(options: FindOneOptions<OrmEntity>) {
    const found = await this.repository.findOne({
      ...options,
      cache: this.cacheEnable,
    });
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async saveMultiple(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map((entity) =>
      this.mapper.toOrmEntity(entity),
    );
    const result = await this.repository.save(ormEntities);
    await Promise.all(
      entities.map((entity) =>
        DomainEvents.publishEvents(entity.id, this.logger, this.correlationId),
      ),
    );
    this.logger.debug(
      `[${entities}]: persisted ${entities.map((entity) => entity.id)}`,
    );
    return result.map((entity) => this.mapper.toDomainEntity(entity));
  }

  async findOne(
    params: QueryParams<EntityProps> = {},
  ): Promise<Entity | undefined> {
    const where = this.prepareQuery(params);
    const found = await this.repository.findOne({
      where,
      relations: this.relations,
      cache: this.cacheEnable,
    });
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps> = {}): Promise<Entity> {
    const found = await this.findOne(params);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findOneByIdOrThrow(id: ID | string): Promise<Entity> {
    const found = await this.repository.findOne({
      where: { id: id instanceof ID ? id.value : id },
      relations: this.relations,
      cache: this.cacheEnable,
    });
    if (!found) {
      throw new NotFoundException();
    }

    return this.mapper.toDomainEntity(found);
  }

  async findManyPaginated({
    where,
    pagination,
    order,
  }: FindManyPaginatedParams<OrmEntity>): Promise<
    DataWithPaginationMeta<Entity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: (pagination?.page - 1) * pagination?.limit,
      take: pagination?.limit,
      where,
      order,
      relations: this.relations,
      cache: this.cacheEnable,
    });

    const result: DataWithPaginationMeta<Entity[]> = {
      data: data.map((item) => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  // abstract findManyPaginatedWithSearch(keyword: string, fields: string[]) : DataWithPaginationMeta<OrmEntity[]>

  async delete(entity: Entity): Promise<Entity> {
    await this.repository.remove(this.mapper.toOrmEntity(entity));
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] deleted ${entity.id.value}`,
    );
    return entity;
  }

  protected createQueryBuilder(entity) {
    return this.repository.createQueryBuilder(entity).cache(this.cacheEnable);
  }

  protected correlationId?: string;

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    // this.setContext();

    return this;
  }

  protected textSearchByFields<OrmEntity>(
    builder: SelectQueryBuilder<OrmEntity>,
    search: string,
    fields: string[],
  ) {
    if (this.isWholePhraseSearch(search)) {
      const term = search.slice(1, -1);
      builder.andWhere(
        new Brackets(this.buildTermFactory<OrmEntity>(term, fields)),
      );
    } else {
      const tokens = this.prepareTokens(search);
      builder.andWhere(
        new Brackets(this.buildTokensFactory<OrmEntity>(tokens, fields)),
      );
    }
    return builder;
  }

  private isWholePhraseSearch(search: string) {
    return search.startsWith(DOUBLE_QUOTE) && search.endsWith(DOUBLE_QUOTE);
  }

  private prepareTokens(search: string) {
    return search.split(DELIMITER);
  }

  private buildTermFactory<OrmEntity>(term: string, fields: string[]) {
    return (qb: SelectQueryBuilder<OrmEntity>) => {
      fields.forEach((field) => {
        qb.orWhere(`LOWER(${field}) LIKE :search`, {
          search: `%${term.toLowerCase()}%`,
        });
      });
    };
  }

  private buildTokensFactory<OrmEntity>(tokens: string[], fields: string[]) {
    return (qb: SelectQueryBuilder<OrmEntity>) => {
      fields.forEach((field) => {
        tokens.forEach((token, index) => {
          qb.orWhere(`LOWER(${field}) LIKE :search_${index}`, {
            [`search_${index}`]: `%${token.toLowerCase()}%`,
          });
        });
      });
    };
  }

  private getContext(): string {
    if (this.correlationId) {
      return `${this.constructor.name}:${this.correlationId}`;
    } else {
      return this.constructor.name;
    }
  }
}
