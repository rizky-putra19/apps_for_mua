import { ResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/response.base';
import { BookingDetailResponse } from '@src/modules/booking/dtos/booking-detail.response.dto';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { Expose } from 'class-transformer';
import { FinanceEntity } from '../domain/entities/finance-entity';

export class FinanceListDisburseResponse extends ResponseBase {
  @Expose({ name: 'artisan_name' })
  artisanName?: string;
  @Expose({ name: 'booking_code' })
  bookingCode: string;
  amount: number;
  @Expose({ name: 'target_bank' })
  targetBank: string;
  @Expose({ name: 'target_bank_account_name' })
  targetBankAccountName: string;
  @Expose({ name: 'target_bank_account_number' })
  targetBankAccountNumber: string;
  @Expose({ name: 'finance_status' })
  financeStatus: string;
  @Expose({ name: 'finance_type' })
  financeType: string;

  constructor(entity: FinanceEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.bookingCode = props.bookingCode;
    this.artisanName = props.user.getPropsCopy().name;
    this.amount = props.amount;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeStatus = props.financeStatus;
    this.financeType = props.financeType;
  }
}

export class FinanceListRefundResponse extends ResponseBase {
  @Expose({ name: 'customer_name' })
  customerName?: string;
  @Expose({ name: 'booking_code' })
  bookingCode: string;
  amount: number;
  @Expose({ name: 'target_bank' })
  targetBank: string;
  @Expose({ name: 'target_bank_account_name' })
  targetBankAccountName: string;
  @Expose({ name: 'target_bank_account_number' })
  targetBankAccountNumber: string;
  @Expose({ name: 'finance_status' })
  financeStatus: string;
  @Expose({ name: 'finance_type' })
  financeType: string;

  constructor(entity: FinanceEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.bookingCode = props.bookingCode;
    this.customerName = props.user.getPropsCopy().name;
    this.amount = props.amount;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeStatus = props.financeStatus;
    this.financeType = props.financeType;
  }
}

export class FinanceDetailRefundResponse extends ResponseBase {
  customer?: UserResponse;
  booking?: BookingDetailResponse;
  amount: number;
  @Expose({ name: 'target_bank' })
  targetBank: string;
  @Expose({ name: 'target_bank_account_name' })
  targetBankAccountName: string;
  @Expose({ name: 'target_bank_account_number' })
  targetBankAccountNumber: string;
  @Expose({ name: 'finance_status' })
  financeStatus: string;
  @Expose({ name: 'finance_type' })
  financeType: string;

  constructor(entity: FinanceEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.amount = props.amount;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeStatus = props.financeStatus;
    this.financeType = props.financeType;
    this.customer = new UserResponse(props.user);
    this.booking = new BookingDetailResponse(props.booking);
  }
}

export class FinanceDetailDisburseResponse extends ResponseBase {
  artisan?: UserResponse;
  booking?: BookingDetailResponse;
  amount: number;
  @Expose({ name: 'target_bank' })
  targetBank: string;
  @Expose({ name: 'target_bank_account_name' })
  targetBankAccountName: string;
  @Expose({ name: 'target_bank_account_number' })
  targetBankAccountNumber: string;
  @Expose({ name: 'finance_status' })
  financeStatus: string;
  @Expose({ name: 'finance_type' })
  financeType: string;

  constructor(entity: FinanceEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.amount = props.amount;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeStatus = props.financeStatus;
    this.financeType = props.financeType;
    this.artisan = new UserResponse(props.user);
    this.booking = new BookingDetailResponse(props.booking);
  }
}

export class DownloadFinanceListDisburse {
  artisan_name?: string;
  booking_code: string;
  amount: number;
  target_bank: string;
  target_bank_account_name: string;
  target_bank_account_number: string;
  finance_status: string;
  finance_type: string;

  constructor(entity: FinanceEntity) {
    const props = entity.getPropsCopy();
    this.booking_code = props.bookingCode.toUpperCase();
    this.artisan_name = props.user.getPropsCopy().name;
    this.amount = props.amount;
    this.target_bank = props.targetBank;
    this.target_bank_account_name = props.targetBankAccountName;
    this.target_bank_account_number = props.targetBankAccountNumber;
    this.finance_status = props.financeStatus;
    this.finance_type = props.financeType;
  }
}

export class DownloadFinanceListRefund {
  customer_name?: string;
  booking_code: string;
  amount: number;
  target_bank: string;
  target_bank_account_name: string;
  target_bank_account_number: string;
  finance_status: string;
  finance_type: string;

  constructor(entity: FinanceEntity) {
    const props = entity.getPropsCopy();
    this.booking_code = props.bookingCode.toUpperCase();
    this.customer_name = props.user.getPropsCopy().name;
    this.amount = props.amount;
    this.target_bank = props.targetBank;
    this.target_bank_account_name = props.targetBankAccountName;
    this.target_bank_account_number = props.targetBankAccountNumber;
    this.finance_status = props.financeStatus;
    this.finance_type = props.financeType;
  }
}
