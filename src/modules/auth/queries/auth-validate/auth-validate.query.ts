import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { IncomingHttpHeaders } from 'http';

export class AuthValidateQuery extends Query {
  readonly headers: IncomingHttpHeaders;
  constructor(props: AuthValidateQuery) {
    super();
    this.headers = props.headers;
  }
}
