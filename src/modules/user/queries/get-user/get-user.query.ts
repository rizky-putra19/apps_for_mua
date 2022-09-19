import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '../../domain/entities/user.entity';

export class GetUserQuery extends Query {
  readonly userId?: string;

  constructor(props: GetUserQuery) {
    super();
    this.userId = props.userId;
  }
}

export class GetArtisanQuery extends Query {
  readonly user: UserEntity;
  readonly userId: string;
  constructor(props: GetArtisanQuery) {
    super();
    this.userId = props.userId;
    this.user = props.user;
  }
}
