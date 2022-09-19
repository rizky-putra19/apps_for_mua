import { Expose } from 'class-transformer';
import { BankAccountStatus } from '../../domain/enums/bank-account-status.enum';
import { FinanceStatus } from '../../domain/enums/finance-status.enum';

export class FindFinanceListQueryParams {
  search?: string;
  @Expose({ name: 'bank_account_status' })
  bankAccountStatus?: BankAccountStatus;
  @Expose({ name: 'finance_status' })
  financeStatus?: FinanceStatus;
  limit?: number;
  page?: number;
  [key: string]: any;
}
