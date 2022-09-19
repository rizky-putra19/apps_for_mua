import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { Column, Entity } from 'typeorm';
import { OtpType } from '../domain/enums/otp-type.enum';

@Entity('otp')
export class OtpOrmEntity extends TypeormEntityBase {
  @Column({ name: 'code', type: 'varchar' })
  code: string;
  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt: Date;
  @Column({ name: 'last_attempt_at', type: 'datetime', nullable: true })
  lastAttemptAt?: Date;
  @Column({ name: 'attempts', type: 'int' })
  attempts: number;
  @Column({ name: 'validation_attempts', type: 'int' })
  validationAttempts: number;
  @Column({ name: 'identifier', type: 'varchar' })
  identifier: string;
  @Column({ name: 'secret', type: 'varchar' })
  secret: string;
  @Column({ name: 'user_type', type: 'varchar' })
  userType: UserType;
  @Column({ name: 'type', type: 'varchar' })
  type: OtpType;
}
