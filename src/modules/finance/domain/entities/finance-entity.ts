import { FinanceStatus } from '../enums/finance-status.enum';
import { FinanceType } from '../enums/finance-type.enum';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';

export interface CreateFinanceProps {
  bookingCode?: string;
  amount: number;
  targetBank?: string;
  targetBankAccountNumber?: string;
  targetBankAccountName?: string;
  financeStatus: FinanceStatus;
  financeType: FinanceType;
  user?: UserEntity;
}

export interface FinanceProps extends CreateFinanceProps {
  booking?: BookingEntity;
}

export class FinanceEntity extends AggregateRoot<FinanceProps> {
  protected _id: ID;

  static create(request: CreateFinanceProps): FinanceEntity {
    const financeId = UUID.generate();
    const financeEntity = new FinanceEntity({
      id: financeId,
      props: {
        user: request.user,
        bookingCode: request.bookingCode,
        amount: request.amount,
        targetBank: request.targetBank,
        targetBankAccountName: request.targetBankAccountName,
        targetBankAccountNumber: request.targetBankAccountNumber,
        financeStatus: request.financeStatus,
        financeType: request.financeType,
      },
    });

    return financeEntity;
  }
}
