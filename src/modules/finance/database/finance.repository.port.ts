import {
  DataWithPaginationMeta,
  FindManyPaginatedSearch,
  RepositoryPort,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { FinanceEntity, FinanceProps } from '../domain/entities/finance-entity';
import { FinanceOrmEntity } from './finance.orm-entity';

export interface FinanceRepositoryPort
  extends RepositoryPort<FinanceEntity, FinanceProps, FinanceOrmEntity> {
  findManyWithSearch({
    params,
    pagination,
  }: FindManyPaginatedSearch): Promise<DataWithPaginationMeta<FinanceEntity[]>>;
}
