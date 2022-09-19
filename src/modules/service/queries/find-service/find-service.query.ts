import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { FindServiceQueryParams } from './find-service.query-params.dto';

export class FindServiceQuery extends Query {
  readonly params: FindServiceQueryParams;
  constructor(props: FindServiceQuery) {
    super();
    this.params = props.params;
  }
}
