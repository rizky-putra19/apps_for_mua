import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetOtpBySecretQuery extends Query {
  readonly secret: string;
  constructor(props: GetOtpBySecretQuery) {
    super();
    this.secret = props.secret;
  }
}
