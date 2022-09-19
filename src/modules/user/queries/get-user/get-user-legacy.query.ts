import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetUserLegacyQuery extends Query {
  readonly legacyId: number;
  constructor(props: GetUserLegacyQuery) {
    super();
    this.legacyId = props.legacyId;
  }
}
