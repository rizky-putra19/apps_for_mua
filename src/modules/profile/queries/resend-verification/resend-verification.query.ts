import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

export class ResendVerificationQuery extends Query {
  readonly email: Email;
  readonly type: UserType;
  readonly name: string;
  readonly id?: ID;
  constructor(props: ResendVerificationQuery) {
    super();
    this.email = props.email;
    this.type = props.type;
    this.name = props.name;
    this.id = props.id;
  }
}
