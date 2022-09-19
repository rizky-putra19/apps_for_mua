import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';
import { OtpEntity, OtpProps } from '../domain/entities/otp.entity';
import { OtpOrmEntity } from './otp.orm-entity';

@Entity('otp')
export class OtpOrmMapper extends OrmMapper<OtpEntity, OtpOrmEntity> {
  protected toDomainProps(ormEntity: OtpOrmEntity): EntityProps<OtpProps> {
    return {
      id: new UUID(ormEntity.id),
      props: {
        code: ormEntity.code,
        attempts: ormEntity.attempts,
        expiresAt: ormEntity.expiresAt,
        identifier: ormEntity.identifier,
        secret: ormEntity.secret,
        validationAttempts: ormEntity.validationAttempts,
        lastAttemptAt: ormEntity.lastAttemptAt,
        userType: ormEntity.userType,
        type: ormEntity.type,
      },
    };
  }
  protected toOrmProps(entity: OtpEntity): OrmEntityProps<OtpOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      code: props.code,
      attempts: props.attempts,
      lastAttemptAt: props.lastAttemptAt,
      validationAttempts: props.validationAttempts,
      expiresAt: props.expiresAt,
      identifier: props.identifier,
      secret: props.secret,
      userType: props.userType,
      type: props.type,
    };
  }
}
