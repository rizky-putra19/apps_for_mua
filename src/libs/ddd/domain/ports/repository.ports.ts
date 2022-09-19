import { BaseEntityProps } from '../base-classes/entity.base';
import { DeepPartial } from '../../../types';
import { ID } from '../value-objects/id.value-object';
import { FindConditions, ObjectLiteral } from 'typeorm';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific interfaces should be defined
    in a respective module/use case.
*/

export const SORT_KEY = 'sort';
export const PAGE_KEY = 'page';
export const RANGE_KEY = 'range';
export const DATE_RANGE_KEY = 'date_range';
export const LIMIT_KEY = 'limit';
export const FILTER_KEY = 'filter';
export const PAGE_DEFAULT = '1';
export const QUERY_KEY = 'search';
export const MAX_LIMIT = 100;
export const QUERY_FIELD = 'title.raw';
export const NON_SEARCH_FIELD_PARAM = [
  SORT_KEY,
  FILTER_KEY,
  RANGE_KEY,
  DATE_RANGE_KEY,
  QUERY_KEY,
  PAGE_KEY,
  LIMIT_KEY,
];
const SORT_SEPARATOR = ':';
const DEFAULT_SORTING_FIELD_ORDER = 'createdAt:desc';

export type QueryParams<EntityProps> = DeepPartial<
  BaseEntityProps & EntityProps
>;

export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface SaveMultiple<Entity> {
  saveMultiple(entities: Entity[]): Promise<Entity[]>;
}

export interface FindOne<Entity, EntityProps> {
  findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity>;
}

export interface FindOneById<Entity> {
  findOneByIdOrThrow(id: ID | string): Promise<Entity>;
}

export interface FindMany<Entity, EntityProps> {
  findMany(params: QueryParams<EntityProps>): Promise<Entity[]>;
}

export interface OrderBy {
  [key: number]: -1 | 1;
}

export interface PaginationMeta {
  skip?: number;
  limit?: number;
  page?: number;
}

export interface FindManyPaginatedParams<OrmEntity> {
  where?:
    | FindConditions<OrmEntity>[]
    | FindConditions<OrmEntity>
    | ObjectLiteral
    | string;
  pagination?: PaginationMeta;

  order?: {
    [P in EntityFieldsNames<OrmEntity>]?: 'ASC' | 'DESC' | 1 | -1;
  };
}

export interface FindManyPaginatedSearch {
  params?: any;
  pagination?: PaginationMeta;
}

export interface DataWithPaginationMeta<T> {
  data: T;
  count: number;
  limit?: number;
  page?: number;
}

export interface DataAndCountMeta<T> {
  data: T;
  count: number;
}

export interface FindManyPaginated<Entity, EntityProps> {
  findManyPaginated(
    options: FindManyPaginatedParams<EntityProps>,
  ): Promise<DataWithPaginationMeta<Entity[]>>;
}

export interface DeleteOne<Entity> {
  delete(entity: Entity): Promise<Entity>;
}

export interface RepositoryPort<Entity, EntityProps, OrmEntity>
  extends Save<Entity>,
    FindOne<Entity, EntityProps>,
    FindOneById<Entity>,
    FindMany<Entity, EntityProps>,
    FindManyPaginated<Entity, OrmEntity>,
    DeleteOne<Entity>,
    SaveMultiple<Entity> {
  setCorrelationId(correlationId: string): this;
}
