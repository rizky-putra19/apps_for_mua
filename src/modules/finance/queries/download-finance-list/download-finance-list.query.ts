import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class DownloadFinanceListQuery extends Query {
  readonly financeType: string;
  constructor(props: DownloadFinanceListQuery) {
    super();
    this.financeType = props.financeType;
  }
}
