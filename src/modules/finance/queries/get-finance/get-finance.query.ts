import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetFinanceQuery extends Query {
  readonly id: string;
  constructor(props: GetFinanceQuery) {
    super();
    this.id = props.id;
  }
}
