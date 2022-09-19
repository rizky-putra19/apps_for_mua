import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('users_metadata')
export class UserMetadataOrmEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  value: string;

  @Column({ name: 'data_type' })
  dataType: string;

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

  @ManyToOne((type) => UserOrmEntity, (user) => user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserOrmEntity;
}
