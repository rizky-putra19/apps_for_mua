import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('editor_choices')
export class EditorChoiceOrmEntity {
  constructor(props?: EditorChoiceOrmEntity) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

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
