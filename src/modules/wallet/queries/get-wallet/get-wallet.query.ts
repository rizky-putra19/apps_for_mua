import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetWalletQuery extends Query {
  readonly artisanID: string;

  constructor(props: GetWalletQuery) {
    super();
    this.artisanID = props.artisanID;
  }
}
