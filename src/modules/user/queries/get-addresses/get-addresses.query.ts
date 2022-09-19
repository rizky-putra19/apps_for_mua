import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '../../domain/entities/user.entity';

export class GetAddressesQuery extends Query {
  readonly user: UserEntity;
  constructor(props: GetAddressesQuery) {
    super();
    this.user = props.user;
  }
}
