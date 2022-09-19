import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { type } from 'os';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeoLocationHistoryOrmEntity } from './geo-location-history.orm-entity';

@Entity('geo_locations')
export class GeoLocationOrmEntity {
  constructor(props?: GeoLocationOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'point' })
  point: string;

  @OneToMany(
    () => GeoLocationHistoryOrmEntity,
    (history) => history.geoLocation,
    {
      cascade: true,
    },
  )
  histories: GeoLocationHistoryOrmEntity[];

  @OneToOne((a) => UserOrmEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan: UserOrmEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;
}
