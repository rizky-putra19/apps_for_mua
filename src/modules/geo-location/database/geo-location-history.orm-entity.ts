import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GeoLocationOrmEntity } from './geo-location.orm-entity';

@Entity('geo_location_history')
export class GeoLocationHistoryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'point' })
  point: string;

  @ManyToOne(() => GeoLocationOrmEntity)
  @JoinColumn({ name: 'geo_location_id', referencedColumnName: 'id' })
  geoLocation: GeoLocationOrmEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    update: false,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt?: Date;
}
