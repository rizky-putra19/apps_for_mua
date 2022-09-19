import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FindBookingQueryParams } from './find-booking.query-params.dto';

export class FindBookingQuery extends Query {
  readonly params: FindBookingQueryParams;
  readonly user?: UserEntity;
  constructor(props: FindBookingQuery) {
    super();
    this.params = props.params;
    this.user = props.user;
  }
}
