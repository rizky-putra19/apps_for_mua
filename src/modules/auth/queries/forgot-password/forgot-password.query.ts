import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class ForgotPasswordQuery extends Query {
  email: Email;
  type: string;
  constructor(props: ForgotPasswordQuery) {
    super();
    this.email = props.email;
    this.type = props.type;
  }
}
