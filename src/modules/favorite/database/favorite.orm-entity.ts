import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('favorites')
export class FavoriteOrmEntity {
  constructor(props?: FavoriteOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((a) => UserOrmEntity)
  @JoinColumn({ name: 'artisan_id' })
  artisan: UserOrmEntity;

  @ManyToOne((c) => UserOrmEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserOrmEntity;

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
