import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { CategoryOrmEntity } from '@src/modules/category/database/category.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ServiceStatus } from '../domain/enum/service-status.enum';
import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';

@Entity('services')
export class ServiceOrmEntity extends TypeormEntityBase {
  @Column({
    nullable: true,
  })
  title?: string;

  @ManyToOne((type) => CategoryOrmEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryOrmEntity;

  @ManyToOne((type) => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  artisan: UserOrmEntity;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'enum', nullable: true, enum: ServiceStatus })
  status: ServiceStatus;

  @Column()
  duration: number;
  @Column()
  price: number;
  @Column({
    name: 'original_price',
  })
  originalPrice: number;

  images?: MediaOrmEntity[];
}
