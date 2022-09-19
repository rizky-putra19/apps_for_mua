import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { WalletEntity } from '../domain/entities/wallet.entity';
import { WalletOrmEntity } from './wallet.orm-entity';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { NotFoundException } from '@src/libs/exceptions';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { WalletHistoryEntity } from '../domain/entities/wallet-history.entity';
import { WalletHistoryOrmEntity } from './wallet-history.orm-entity';
import moment from 'moment';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(WalletOrmEntity)
    private readonly walletRepository: Repository<WalletOrmEntity>,
    @InjectRepository(WalletHistoryOrmEntity)
    private readonly walletHistoryRepository: Repository<WalletHistoryOrmEntity>,
  ) {}

  async findOneByUserId(id: string | ID): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({
      where: {
        artisan: {
          id,
        },
      },
      relations: ['artisan', 'histories'],
    });
    if (!wallet) {
      throw new NotFoundException();
    }
    const walletEntity = WalletEntity.convertToDomainEntity(wallet);
    return walletEntity;
  }

  async save(entity: WalletEntity) {
    const ormEntity = WalletEntity.convertToOrmEntity(entity);
    const result = await this.walletRepository.save(ormEntity);

    return WalletEntity.convertToDomainEntity(result);
  }

  async findWithSearchWalletHistory({
    params,
  }): Promise<DataAndCountMeta<WalletHistoryEntity[]>> {
    const qb = this.walletHistoryRepository
      .createQueryBuilder('wallet_history')
      .leftJoinAndSelect('wallet_history.wallet', 'wallets')
      .leftJoinAndSelect('wallets.artisan', 'users');
    if (params.artisanID) {
      qb.where(
        new Brackets((qb) => {
          qb.where('wallets.artisan.id = :artisanID', {
            artisanID: params.artisanID,
          });
        }),
      );
    }

    if (params.status) {
      qb.where(
        new Brackets((qb) => {
          qb.andWhere('wallet_history.status = :status', {
            status: params.status,
          });
        }),
      );
    }

    if (params.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('lower(wallet_history.bookingCode) like lower(:search)', {
            search: params.search,
          }).orWhere('lower(wallet_history.description) like lower(:search)', {
            search: params.search,
          });
        }),
      );
    }

    if (params.createdDate) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('wallet_history.createdAt >= :startDate', {
            startDate: params.startDate,
          }).andWhere('wallet_history.createdAt <= :toDate', {
            toDate: params.toDate,
          });
        }),
      );
    }

    const [data, count] = await qb
      .orderBy({ 'wallet_history.createdAt': 'DESC' })
      .getManyAndCount();

    const result: DataAndCountMeta<WalletHistoryEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const wallet = await this.walletRepository.findOne({
            where: {
              artisan: {
                id: params.artisanID,
              },
            },
          });
          item.wallet = wallet;
          return WalletHistoryEntity.domainEntityForWalletHistory(item);
        }),
      ),
      count,
    };

    return result;
  }
}
