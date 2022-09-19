import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class ProfileQuery extends Query {
  readonly user: UserEntity;
  constructor(props: ProfileQuery) {
    super();
    this.user = props.user;
  }
}
