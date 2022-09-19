import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class FindUserQuery extends Query {
  readonly identifier: string;
  readonly userType: string;
  readonly findType: 'email' | 'legacyId' | 'id' | 'phoneNumber' | 'username';

  constructor(props: FindUserQuery) {
    super();
    this.userType = props.userType;
    this.identifier = props.identifier;
    this.findType = props.findType;
  }
}
