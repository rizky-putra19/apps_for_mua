import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { FindWalletHistoryQueryParams } from './find-wallet-history.query-params.dto';

export class FindWalletHistoryQuery extends Query {
  readonly params: FindWalletHistoryQueryParams;
  constructor(props: FindWalletHistoryQuery) {
    super();
    this.params = props.params;
  }
}
