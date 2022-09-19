import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryStatus } from '../domain/enums/category-status.enum';

@Entity('categories')
export class CategoryOrmEntity {
  constructor(props?: CategoryOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  })
  status: CategoryStatus;

  @ManyToOne((type) => CategoryOrmEntity, (service) => service.childrens)
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryOrmEntity;

  @OneToMany((type) => CategoryOrmEntity, (service) => service.parent)
  childrens?: CategoryOrmEntity[];

  @Column()
  ordering: number;

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

  icon?: MediaOrmEntity;
}
