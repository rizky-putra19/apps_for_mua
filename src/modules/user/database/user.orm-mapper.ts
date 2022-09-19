import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { MediaOrmMapper } from '@src/modules/media/database/media.orm-mapper';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { UserMetadataEntity } from '../domain/entities/user-metadata';
import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { UserMetadataOrmEntity } from './user-metadata.orm-entity';
import { UserOrmEntity } from './user.orm-entity';

export class UserOrmMapper extends OrmMapper<UserEntity, UserOrmEntity> {
  protected toOrmProps(entity: UserEntity): OrmEntityProps<UserOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      email: props.email,
      password: Buffer.from(props.password),
      name: props.name,
      username: props.username,
      type: props.type,
      legacyId: props.legacyId,
      phoneNumber: props.phoneNumber,
      status: props.status,
      avatar: MediaOrmMapper.convertToOrmEntity(props.avatar),
      wallet: !props.wallet
        ? null
        : WalletEntity.convertToOrmEntity(props.wallet),
      metadata: props.metadata?.map((m: UserMetadataEntity) => {
        const metadata = new UserMetadataOrmEntity();
        metadata.id = m.id;
        metadata.name = m.name;
        metadata.value = m.value;
        metadata.dataType = m.dataType;
        return metadata;
      }),
    };
  }

  protected toDomainProps(ormEntity: UserOrmEntity): EntityProps<UserProps> {
    const id = new UUID(ormEntity.id);
    const props: UserProps = {
      email: ormEntity.email,
      name: ormEntity.name,
      username: ormEntity.username,
      password: ormEntity.password.toString(),
      legacyId: ormEntity.legacyId,
      type: ormEntity.type,
      facebookId: ormEntity.facebookId,
      googleId: ormEntity.googleId,
      phoneNumber: ormEntity.phoneNumber,
      status: ormEntity.status,
      avatar: MediaOrmMapper.convertToDomainEntity(ormEntity.avatar),
      wallet: !ormEntity.wallet
        ? null
        : WalletEntity.convertToDomainEntity(ormEntity.wallet),
      metadata: ormEntity.metadata?.map(
        (m) =>
          new UserMetadataEntity({
            id: m.id,
            name: m.name,
            value: m.value,
            dataType: m.dataType,
          }),
      ),
    };
    return {
      id,
      props,
    };
  }

  static convertToOrmEntity(userEntity: UserEntity): UserOrmEntity | null {
    if (userEntity != undefined) {
      const ormMapper = new UserOrmMapper(UserEntity, UserOrmEntity);
      return ormMapper.toOrmEntity(userEntity);
    }
  }
  static convertToDomainEntity(ormEntity?: UserOrmEntity): UserEntity | null {
    if (ormEntity) {
      const ormMapper = new UserOrmMapper(UserEntity, UserOrmEntity);
      return ormMapper.toDomainEntity(ormEntity);
    }
  }
}
