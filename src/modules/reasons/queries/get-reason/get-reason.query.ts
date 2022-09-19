import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetReasonQuery extends Query {
  readonly id?: number;

  constructor(props: GetReasonQuery) {
    super();
    this.id = props.id;
  }
}
