import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReasonType } from '../domain/enums/reason-type.enum';

@Entity('reasons')
export class ReasonOrmEntiy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ReasonType,
  })
  type: ReasonType;

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
