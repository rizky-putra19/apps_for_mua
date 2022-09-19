import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { CategoryEntity } from '@src/modules/category/domain/entities/category.entity';
import { MediaEntity } from '@src/modules/media/domain/entities/media.entity';
import { ServiceEntity } from '@src/modules/service/domain/entities/service.entity';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { hashSync, genSaltSync } from 'bcrypt';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';
import { UserCreatedDomainEvent } from '../events/user-created.domain-event';
import { UserMetadataEntity } from './user-metadata';
export interface CreateUserProps {
  email: string;
  name?: string;
  username?: string;
  password: string;
  type: UserType;
  legacyId?: number;
  facebookId?: string;
  googleId?: string;
  appleId?: string;
  phoneNumber?: string;
  status: UserStatus;
}

export interface UserProps extends CreateUserProps {
  avatar?: MediaEntity;
  metadata: UserMetadataEntity[];
  isFavorite?: boolean;
  favorite?: number;
  jobDone?: number;
  rating?: number;
  category?: CategoryEntity[];
  wallet?: WalletEntity;
}

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: UUID;

  static create(request: UserProps): UserEntity {
    const id = UUID.generate();
    const salt = genSaltSync(12);
    const props: UserProps = {
      email: request.email,
      password:
        request.password != null ? hashSync(request.password, salt) : null,
      name: request.name,
      username: request.username,
      type: request.type,
      legacyId: request.legacyId,
      facebookId: request.facebookId,
      googleId: request.googleId,
      appleId: request.appleId,
      phoneNumber: request.phoneNumber,
      status: request.status,
      metadata: request.metadata,
      wallet: request.wallet,
    };

    const user = new UserEntity({ id, props });
    user.addEvent(
      new UserCreatedDomainEvent({
        name: props.name,
        aggregateId: id.value,
        email: props.email,
        type: props.type,
        id,
      }),
    );
    return user;
  }
}
