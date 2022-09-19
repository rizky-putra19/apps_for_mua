import { WalletHistoryStatus } from '../../domain/enums/wallet-history-status.enum';

export class FindWalletHistoryQueryParams {
  artisanID?: string;
  search?: string;
  createdDate?: boolean;
  startDate?: Date;
  toDate?: Date;
  status?: WalletHistoryStatus;
  [key: string]: any;
}
