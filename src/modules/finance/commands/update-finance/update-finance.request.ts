import { Expose } from 'class-transformer';

export class UpdateFinanceRequest {
  @Expose({ name: 'target_bank' })
  readonly targetBank?: string;
  @Expose({ name: 'target_bank_account_name' })
  readonly targetBankAccountName?: string;
  @Expose({ name: 'target_bank_account_number' })
  readonly targetBankAccountNumber: string;
  @Expose({ name: 'finance_status' })
  readonly financeStatus: string;
}
