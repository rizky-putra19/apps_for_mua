import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class GetProcessCodeQuery extends Query {
  readonly bookingID: string;
  readonly user: UserEntity;
  constructor(props: GetProcessCodeQuery) {
    super();
    this.bookingID = props.bookingID;
    this.user = props.user;
  }
}
