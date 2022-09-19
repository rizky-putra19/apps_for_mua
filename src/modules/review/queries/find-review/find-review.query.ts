import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class FindReviewQuery extends Query {
  readonly artisanID: string;
  constructor(props: FindReviewQuery) {
    super();
    this.artisanID = props.artisanID;
  }
}
