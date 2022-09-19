import { ReasonEntity } from '../../domain/entities/reason.entity';
import { ReasonType } from '../../domain/enums/reason-type.enum';
import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';

export class GetReasonsQuery extends Query {
  readonly type: ReasonType;

  constructor(props: GetReasonsQuery) {
    super();
    this.type = props.type;
  }
}
