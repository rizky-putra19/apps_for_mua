import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

export class ValidateOtpQuery extends Query {
  readonly identifier: string;
  readonly code: string;
  readonly userType: UserType;
  constructor(props: ValidateOtpQuery) {
    super();
    this.code = props.code;
    this.identifier = props.identifier;
    this.userType = props.userType;
  }
}
