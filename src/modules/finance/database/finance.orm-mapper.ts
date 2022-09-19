import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { FinanceEntity, FinanceProps } from '../domain/entities/finance-entity';
import { FinanceOrmEntity } from './finance.orm-entity';

export class FinanceOrmMapper extends OrmMapper<
  FinanceEntity,
  FinanceOrmEntity
> {
  protected toDomainProps(
    ormEntity: FinanceOrmEntity,
  ): EntityProps<FinanceProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        bookingCode: ormEntity.bookingCode,
        amount: ormEntity.amount,
        targetBank: ormEntity.targetBank,
        targetBankAccountName: ormEntity.targetBankAccountName,
        targetBankAccountNumber: ormEntity.targetBankAccountNumber,
        financeStatus: ormEntity.financeStatus,
        financeType: ormEntity.financeType,
        user: UserOrmMapper.convertToDomainEntity(ormEntity.user),
      },
    };
  }
  protected toOrmProps(
    entity: FinanceEntity,
  ): OrmEntityProps<FinanceOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      bookingCode: props.bookingCode,
      amount: props.amount,
      targetBank: props.targetBank,
      targetBankAccountName: props.targetBankAccountName,
      targetBankAccountNumber: props.targetBankAccountNumber,
      financeStatus: props.financeStatus,
      financeType: props.financeType,
      user: UserOrmMapper.convertToOrmEntity(props.user),
    };
  }

  static converToOrmEntity(
    financeEntity: FinanceEntity,
  ): FinanceOrmEntity | null {
    if (financeEntity != undefined) {
      const ormMapper = new FinanceOrmMapper(FinanceEntity, FinanceOrmEntity);
      return ormMapper.toOrmEntity(financeEntity);
    }
  }

  static convertToDomainEntity(
    ormEntity?: FinanceOrmEntity,
  ): FinanceEntity | null {
    if (ormEntity) {
      const ormMapper = new FinanceOrmMapper(FinanceEntity, FinanceOrmEntity);
      return ormMapper.toDomainEntity(ormEntity);
    }
  }
}
