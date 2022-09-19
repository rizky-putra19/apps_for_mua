import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('devices')
@Index('device_type_uniq_idx', ['deviceId', 'type'], { unique: true })
export class DeviceOrmEntity extends TypeormEntityBase {
  constructor(props: DeviceOrmEntity) {
    super(props);
  }

  @Column({ name: 'push_token', type: 'text' })
  pushToken: string;

  @Column({ name: 'device_id' })
  deviceId: string;

  @Column()
  platform: string;

  @Column({ enum: UserType, type: 'enum', default: UserType.CUSTOMER })
  type: UserType;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
