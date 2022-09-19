import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import { PaymentEntity, PaymentProps } from '../domain/entities/payment-entity';
import { PaymentOrmEntity } from './payment.orm-entity';
import { PaymentOrmMapper } from './payment.orm-mapper';

export class PaymentRepository extends TypeormRepositoryBase<
  PaymentEntity,
  PaymentProps,
  PaymentOrmEntity
> {
  protected relations: string[];

  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly paymentRepository: Repository<PaymentOrmEntity>,
  ) {
    super(
      paymentRepository,
      new PaymentOrmMapper(PaymentEntity, PaymentOrmEntity),
      new Logger('PaymentRepository'),
    );
  }

  // async findById(id: number): Promise<PaymentOrmEntity> {
  //   const result = await this.paymentRepository.findOne(id);

  //   return result;
  // }
  // async save(entity: PaymentEntity): Promise<PaymentOrmEntity> {
  //   return this.paymentRepository.save(
  //     PaymentEntity.convertToOrmEntity(entity),
  //   );
  // }

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & PaymentProps>,
  ): WhereCondition<PaymentOrmEntity> {
    throw new Error('Method not implemented.');
  }
}
