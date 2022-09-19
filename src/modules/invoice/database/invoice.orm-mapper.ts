import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { PaymentOrmMapper } from '@src/modules/payment/database/payment.orm-mapper';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { InvoiceEntity, InvoiceProps } from '../domain/entities/invoice.entity';
import { InvoiceOrmEntity } from './invoice.orm-entity';

export class InvoiceOrmMapper extends OrmMapper<
  InvoiceEntity,
  InvoiceOrmEntity
> {
  protected toDomainProps(
    ormEntity: InvoiceOrmEntity,
  ): EntityProps<InvoiceProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        artisan: UserOrmMapper.convertToDomainEntity(ormEntity.artisan),
        customer: UserOrmMapper.convertToDomainEntity(ormEntity.customer),
        booking: BookingOrmMapper.toDomainEntity(ormEntity.booking),
        code: ormEntity.code,
        grandTotal: ormEntity.grandTotal,
        status: ormEntity.status,
        subtotal: ormEntity.subtotal,
        payment: PaymentOrmMapper.convertToDomainEntity(ormEntity.payment),
      },
    };
  }
  protected toOrmProps(
    entity: InvoiceEntity,
  ): OrmEntityProps<InvoiceOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      artisan: UserOrmMapper.convertToOrmEntity(props.artisan),
      customer: UserOrmMapper.convertToOrmEntity(props.customer),
      code: props.code,
      grandTotal: props.grandTotal,
      payment: PaymentOrmMapper.convertToOrmEntity(props.payment),
      booking: BookingOrmMapper.convertToOrmEntity(props.booking),
      status: props.status,
      subtotal: props.subtotal,
    };
  }

  static convertToOrmEntity(entity: InvoiceEntity) {
    if (entity) {
      const mapper = new InvoiceOrmMapper(InvoiceEntity, InvoiceOrmEntity);
      return mapper.toOrmEntity(entity);
    }
  }

  static convertToDomainEntity(ormEntity: InvoiceOrmEntity) {
    if (ormEntity) {
      const mapper = new InvoiceOrmMapper(InvoiceEntity, InvoiceOrmEntity);
      return mapper.toDomainEntity(ormEntity);
    }
  }
}
