import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';

@Entity('api_clients')
export class ApiClientOrmEntity extends TypeormEntityBase {
  constructor(props?: ApiClientOrmEntity) {
    super(props);
  }

  @Column({ name: 'secret' })
  secret: string;

  @Column({ name: 'grant_types', type: 'simple-array' })
  grantTypes: string[];
}
