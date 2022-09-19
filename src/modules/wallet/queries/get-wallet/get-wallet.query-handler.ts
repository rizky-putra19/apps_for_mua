import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { WalletRepository } from '../../database/wallet.repository';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { GetWalletQuery } from './get-wallet.query';

@QueryHandler(GetWalletQuery)
export class GetWalletQueryHandler extends QueryHandlerBase {
  constructor(private readonly walletRepository: WalletRepository) {
    super();
  }
  async handle(query: GetWalletQuery): Promise<Result<WalletEntity, Error>> {
    try {
      const { artisanID } = query;
      const wallet = await this.walletRepository.findOneByUserId(artisanID);

      return Result.ok(wallet);
    } catch (error) {
      return Result.err(error);
    }
  }
}
