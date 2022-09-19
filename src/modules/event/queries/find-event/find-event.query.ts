import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { FindEventQueryParams } from './find-event.query-params.dto';

export class FindEventQuery extends Query {
  readonly findEventQueryParams: FindEventQueryParams;
  readonly isAdmin: boolean;
  constructor(props: FindEventQuery) {
    super();
    this.findEventQueryParams = props.findEventQueryParams;
    this.isAdmin = this.isAdmin;
  }
}
