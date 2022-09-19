import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

export class GetOtpByIdentifierQuery extends Query {
  readonly identifier: string;
  readonly userType: UserType;
  constructor(props: GetOtpByIdentifierQuery) {
    super();
    this.identifier = props.identifier;
    this.userType = props.userType;
  }
}
