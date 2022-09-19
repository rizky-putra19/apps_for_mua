import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyPaginatedSearch,
  DataWithPaginationMeta,
  QueryParams,
} from '@src/libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { NotFoundException } from '@src/libs/exceptions';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { FinanceEntity, FinanceProps } from '../domain/entities/finance-entity';
import { FinanceStatus } from '../domain/enums/finance-status.enum';
import { FinanceType } from '../domain/enums/finance-type.enum';
import { FinanceOrmEntity } from './finance.orm-entity';
import { FinanceOrmMapper } from './finance.orm-mapper';
import { FinanceRepositoryPort } from './finance.repository.port';

Injectable();
export class FinanceRepository
  extends TypeormRepositoryBase<FinanceEntity, FinanceProps, FinanceOrmEntity>
  implements FinanceRepositoryPort
{
  protected relations: string[] = ['user', 'user.metadata'];
  constructor(
    @InjectRepository(FinanceOrmEntity)
    private readonly financeRepository: Repository<FinanceOrmEntity>,
    private readonly userRepository: UserRepository,
  ) {
    super(
      financeRepository,
      new FinanceOrmMapper(FinanceEntity, FinanceOrmEntity),
      new Logger('FinanceRepository'),
    );
  }

  async findFinanceById(id: string): Promise<FinanceEntity> {
    const finance = await this.financeRepository.findOne({
      where: {
        id,
      },
      relations: this.relations,
    });
    if (!finance) {
      throw new NotFoundException();
    }
    const financeEntity = FinanceOrmMapper.convertToDomainEntity(finance);
    return financeEntity;
  }

  async findManyWithSearch({
    params,
    pagination,
  }: FindManyPaginatedSearch): Promise<
    DataWithPaginationMeta<FinanceEntity[]>
  > {
    const qb = this.createQueryBuilder('finances')
      .leftJoinAndSelect('finances.user', 'user')
      .leftJoinAndSelect('user.metadata', 'user_metadata');

    if (params.financeType == 'disburse') {
      qb.where(
        new Brackets((qb) => {
          qb.where(`finances.financeType = 'disburse'`);
        }),
      );
    }

    if (params.financeType == 'refund') {
      qb.where(
        new Brackets((qb) => {
          qb.where(`finances.financeType = 'refund'`);
        }),
      );
    }

    if (params.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('lower(finances.bookingCode) like lower(:search)', {
            search: params.search,
          })
            .orWhere('lower(user.name) like lower(:search)', {
              search: params.search,
            })
            .orWhere('lower(user.username) like lower(:search)', {
              search: params.search,
            });
        }),
      );
    }

    if (params.bankAccountStatus == 'available') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('finances.targetBank is not null')
            .andWhere('finances.targetBankAccountName is not null')
            .andWhere('finances.targetBankAccountNumber is not null');
        }),
      );
    }

    if (params.bankAccountStatus == 'unavailable') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('finances.targetBank is null')
            .andWhere('finances.targetBankAccountName is null')
            .andWhere('finances.targetBankAccountNumber is null');
        }),
      );
    }

    if (params.financeStatus == 'waiting') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`finances.financeStatus = 'waiting'`);
        }),
      );
    }

    if (params.financeStatus == 'done') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(`finances.financeStatus = 'done'`);
        }),
      );
    }

    const [data, count] = await qb
      .skip(pagination?.skip)
      .take(pagination?.limit)
      .orderBy('finances.createdAt', 'DESC')
      .getManyAndCount();

    const result: DataWithPaginationMeta<FinanceEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const user = await this.userRepository.findById(item.user.id);

          item.user = UserOrmMapper.convertToOrmEntity(user);
          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async findByFinanceType(financeType: string): Promise<FinanceEntity[]> {
    const financeList = await this.repository.find({
      where: {
        financeType,
        financeStatus: 'waiting',
        targetBank: Not(IsNull()),
        targetBankAccountName: Not(IsNull()),
        targetBankAccountNumber: Not(IsNull()),
      },
      relations: this.relations,
      order: {
        createdAt: 'DESC',
      },
    });

    return financeList.map((f) => this.mapper.toDomainEntity(f));
  }

  protected prepareQuery(
    params: QueryParams<FinanceProps>,
  ): WhereCondition<FinanceOrmEntity> {
    const where: QueryParams<FinanceOrmEntity> = {};

    return where;
  }
}
