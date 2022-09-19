import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetServiceQuery extends Query {
  readonly serviceID: string;
  constructor(props: GetServiceQuery) {
    super();
    this.serviceID = props.serviceID;
  }
}
