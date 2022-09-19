import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';
import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { ServiceOrmEntity } from '@src/modules/service/database/service.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity('events')
export class EventOrmEntity extends TypeormEntityBase {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  eventStartAt: Date;
  @Column()
  eventEndAt: Date;
  @ManyToMany(() => ServiceOrmEntity)
  @JoinTable({
    name: 'events_services',
    joinColumn: { name: 'event_id' },
    inverseJoinColumn: { name: 'service_id' },
  })
  services: ServiceOrmEntity[];
  @ManyToMany(() => UserOrmEntity)
  @JoinTable({
    name: 'events_participants',
    joinColumn: { name: 'event_id' },
    inverseJoinColumn: { name: 'participant_id' },
  })
  participants: UserOrmEntity[];
  @Column()
  status: string;
  @Column()
  type: string;
  @Column({ type: 'text' })
  address?: string;
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude?: number;
  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude?: number;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
