import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class GetEventQuery extends Query {
  constructor(public readonly id: ID) {
    super();
  }
}
