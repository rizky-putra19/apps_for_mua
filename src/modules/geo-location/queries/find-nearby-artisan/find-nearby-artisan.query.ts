import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { FindNearbyArtisanRequest } from './find-nearby-artisan.request';

export class FindNearbyArtisanQuery extends Query {
  readonly user: UserEntity;
  readonly geoLocation: FindNearbyArtisanRequest;
  constructor(props: FindNearbyArtisanQuery) {
    super();
    this.user = props.user;
    this.geoLocation = props.geoLocation;
  }
}
