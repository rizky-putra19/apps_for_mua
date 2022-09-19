import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class FindApiClientQuery extends Query {
  readonly clientId: ID;

  constructor(props: FindApiClientQuery) {
    super();
    this.clientId = props.clientId;
  }
}
