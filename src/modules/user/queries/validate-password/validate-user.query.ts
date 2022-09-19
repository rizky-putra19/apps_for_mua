import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class ValidateUserQuery extends Query {
  readonly email: Email;
  readonly password: string;
  readonly type: string;

  constructor(props: ValidateUserQuery) {
    super();
    this.email = props.email;
    this.password = props.password;
    this.type = props.type;
  }
}
