import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { LoginRequest } from './login.request.dto';

export class LoginQuery extends Query {
  readonly request: LoginRequest;
  constructor(props: LoginQuery) {
    super();
    this.request = props.request;
  }
}
