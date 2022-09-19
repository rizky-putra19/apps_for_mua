import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '../../domain/entities/user.entity';
import { FindArtisanCustomerListQueryParams } from './find-artisan-customer-list.query-params';

export class FindArtisanCustomerListQuery extends Query {
  readonly user?: UserEntity;
  readonly userType?: string;
  readonly params?: FindArtisanCustomerListQueryParams;
  constructor(props?: FindArtisanCustomerListQuery) {
    super();
    this.user = props.user;
    this.userType = props.userType;
    this.params = props.params;
  }
}
