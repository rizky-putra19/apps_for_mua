import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FinanceStatus } from '../domain/enums/finance-status.enum';
import { FinanceType } from '../domain/enums/finance-type.enum';

@Entity('finances')
export class FinanceOrmEntity extends TypeormEntityBase {
  @Column({ name: 'booking_code' })
  bookingCode: string;

  @Column()
  amount: number;

  @Column({ name: 'target_bank', nullable: true })
  targetBank?: string;

  @Column({ name: 'target_bank_account_number', nullable: true })
  targetBankAccountNumber?: string;

  @Column({ name: 'target_bank_account_name', nullable: true })
  targetBankAccountName?: string;

  @Column({
    name: 'finance_status',
    type: 'enum',
    nullable: true,
    enum: FinanceStatus,
  })
  financeStatus: FinanceStatus;

  @Column({
    name: 'finance_type',
    type: 'enum',
    nullable: true,
    enum: FinanceType,
  })
  financeType: FinanceType;

  @ManyToOne((type) => UserOrmEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserOrmEntity;
}
