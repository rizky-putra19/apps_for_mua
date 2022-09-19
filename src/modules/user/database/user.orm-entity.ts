import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { UserStatus } from '../domain/enums/user-status.enum';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { UserType } from '../domain/enums/user-type.enum';
import { UserMetadataOrmEntity } from './user-metadata.orm-entity';
import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import { UserAddressOrmEntity } from './user-addresses.orm-entity';
import { WalletOrmEntity } from '@src/modules/wallet/database/wallet.orm-entity';

@Entity('users')
@Index('email_uniq_idx', ['email', 'type'], { unique: true })
@Index('phone_uniq_idx', ['phoneNumber', 'type'], { unique: true })
@Index('username_uniq_idx', ['username', 'type'], { unique: true })
@Index('idx_fulltext_search', ['username'], { fulltext: true })
export class UserOrmEntity extends TypeormEntityBase {
  constructor(props?: UserOrmEntity) {
    super(props);
  }
  @Column()
  email: string;

  @Column()
  password: Buffer;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ name: 'legacy_id', nullable: true })
  legacyId: number;

  @Column({ nullable: true, name: 'facebook_id' })
  facebookId?: string;

  @Column({ nullable: true, name: 'google_id' })
  googleId?: string;

  @Column({ nullable: true, name: 'apple_id' })
  appleId?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @OneToMany((_) => UserMetadataOrmEntity, (metadata) => metadata.user, {
    cascade: true,
  })
  metadata: UserMetadataOrmEntity[];

  @OneToMany((type) => UserAddressOrmEntity, (addresses) => addresses.user, {
    cascade: true,
  })
  addresses?: UserAddressOrmEntity[];

  @OneToOne((w) => WalletOrmEntity, (wallet) => wallet.artisan, {
    cascade: true,
  })
  wallet?: WalletOrmEntity;

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserType,
  })
  type: UserType;

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserStatus,
    default: UserStatus.UNVERIFIED_EMAIL,
  })
  status?: UserStatus;

  avatar?: MediaOrmEntity;
}
