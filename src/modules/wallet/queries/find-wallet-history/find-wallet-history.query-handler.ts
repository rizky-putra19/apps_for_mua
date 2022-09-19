import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { WalletRepository } from '../../database/wallet.repository';
import { WalletHistoryEntity } from '../../domain/entities/wallet-history.entity';
import { FindWalletHistoryQuery } from './find-wallet-history.query';
import moment from 'moment';

@QueryHandler(FindWalletHistoryQuery)
export class FindWalletHistoryQueryHandler extends QueryHandlerBase {
  constructor(private readonly walletRepository: WalletRepository) {
    super();
  }
  async handle(
    query: FindWalletHistoryQuery,
  ): Promise<Result<DataAndCountMeta<WalletHistoryEntity[]>, Error>> {
    const { params } = query;

    const walletHistories =
      await this.walletRepository.findWithSearchWalletHistory({
        params: {
          artisanID: params.artisanID,
          search: params.search,
          status: params.status,
          createdDate: params.createdDate,
          startDate: moment(params.startDate).toDate(),
          toDate: moment(params.toDate).toDate(),
        },
      });

    return Result.ok(walletHistories);
  }
}
