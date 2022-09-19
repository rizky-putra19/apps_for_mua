import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { PaymentEntity, PaymentProps } from '../domain/entities/payment-entity';
import { PaymentOrmEntity } from './payment.orm-entity';

export class PaymentOrmMapper extends OrmMapper<
  PaymentEntity,
  PaymentOrmEntity
> {
  protected toDomainProps(
    ormEntity: PaymentOrmEntity,
  ): EntityProps<PaymentProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        payload: ormEntity.payload,
        status: ormEntity.status,
        total: ormEntity.total,
        url: ormEntity.url,
        callback: ormEntity.callback,
        bankCode: ormEntity.bankCode,
        paymentChannel: ormEntity.paymentChannel,
        paymentMethod: ormEntity.paymentMethod,
        providerId: ormEntity.providerId,
      },
    };
  }
  protected toOrmProps(
    entity: PaymentEntity,
  ): OrmEntityProps<PaymentOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      callback: props.callback,
      payload: props.payload,
      status: props.status,
      total: props.total,
      url: props.url,
      bankCode: props.bankCode,
      paymentChannel: props.paymentChannel,
      paymentMethod: props.paymentMethod,
      providerId: props.providerId,
    };
  }

  static convertToDomainEntity(ormEntity: PaymentOrmEntity) {
    const mapper = new PaymentOrmMapper(PaymentEntity, PaymentOrmEntity);
    return mapper.toDomainEntity(ormEntity);
  }
  static convertToOrmEntity(entity: PaymentEntity) {
    const mapper = new PaymentOrmMapper(PaymentEntity, PaymentOrmEntity);
    return mapper.toOrmEntity(entity);
  }
}
