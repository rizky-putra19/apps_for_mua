import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { FinanceRepository } from '../../database/finance.repository';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import { FindFinanceListQuery } from './find-finance-list.query';

@QueryHandler(FindFinanceListQuery)
export class FindFinanceListQueryHandler extends QueryHandlerBase {
  constructor(private readonly financeRepository: FinanceRepository) {
    super();
  }
  async handle(
    query: FindFinanceListQuery,
  ): Promise<Result<DataWithPaginationMeta<FinanceEntity[]>, Error>> {
    const { params, financeType } = query;
    let { page = 0, limit = 25 } = params;

    const result = await this.financeRepository.findManyWithSearch({
      params: {
        financeType,
        financeStatus: params.financeStatus,
        bankAccountStatus: params.bankAccountStatus,
        search: params.search,
      },
      pagination: {
        limit: parseInt(limit.toString(), 10),
        skip: page * limit,
        page: parseInt(page.toString(), 10),
      },
    });

    return Result.ok(result);
  }
}
