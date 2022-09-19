import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';
import { MediaType } from '../domain/enums/media-type.enum';

@Entity('media')
export class MediaOrmEntity extends TypeormEntityBase {
  constructor(props?: MediaOrmEntity) {
    super(props);
  }

  @Column()
  filename: string;
  @Column()
  uploaded: boolean;
  @Column({ name: 'type_id', nullable: true })
  typeId?: string;
  @Column({ name: 'type' })
  type: string;
  @Column({ name: 'url', nullable: true })
  url?: string;
  @Column({ name: 'media_type', type: 'enum', enum: MediaType })
  mediaType: MediaType;
}
