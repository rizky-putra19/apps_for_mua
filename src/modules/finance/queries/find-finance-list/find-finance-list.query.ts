import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { FindFinanceListQueryParams } from './find-finance-list.query-params.dto';

export class FindFinanceListQuery extends Query {
  readonly financeType: string;
  readonly params: FindFinanceListQueryParams;
  constructor(props: FindFinanceListQuery) {
    super();
    this.financeType = props.financeType;
    this.params = props.params;
  }
}
