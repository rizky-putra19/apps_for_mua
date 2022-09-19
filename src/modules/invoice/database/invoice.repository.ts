import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Repository } from 'typeorm';
import { InvoiceOrmEntity } from './invoice.orm-entity';
import { InvoiceEntity, InvoiceProps } from '../domain/entities/invoice.entity';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { DeepPartial } from '@src/libs/types';
import { InvoiceOrmMapper } from './invoice.orm-mapper';

@Injectable()
export class InvoiceRepository extends TypeormRepositoryBase<
  InvoiceEntity,
  InvoiceProps,
  InvoiceOrmEntity
> {
  constructor(
    @InjectRepository(InvoiceOrmEntity)
    readonly invoiceRepository: Repository<InvoiceOrmEntity>,
  ) {
    super(
      invoiceRepository,
      new InvoiceOrmMapper(InvoiceEntity, InvoiceOrmEntity),
      new Logger('InvoiceRepository'),
    );
  }
  protected relations: string[] = ['payment', 'booking', 'customer', 'artisan'];
  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & InvoiceProps>,
  ): WhereCondition<InvoiceOrmEntity> {
    const where: WhereCondition<InvoiceOrmEntity> = {};
    if (params.code) {
      where.code = params.code;
    }

    return where;
  }

  async findByCode(code: string) {
    const res = await this.findOneRaw({
      where: {
        code: code,
      },
    });
    return;
  }

  async generateCode(bookingId: string) {
    const year = moment().format('YY');
    const month = moment().format('MM');
    const hourMinuteSeconds = moment().format('HHmmss');
    return `BEB/INV/${moment().format('YYYYMMDD')}/${this.romanize(
      month,
    )}/${this.romanize(year)}/${bookingId.split('-')[0]}/${hourMinuteSeconds}`;
  }

  private romanize(s: string) {
    let num = Number(s);

    var lookup = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      },
      roman = '',
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }
}
