import { AdminEntity, AdminProps } from '../domain/entities/admin.entity';
import {
  OrderBy,
  RepositoryPort,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { AdminOrmEntity } from './admin.orm-entity';

export interface AdminRepositoryPort
  extends RepositoryPort<AdminEntity, AdminProps, AdminOrmEntity> {
  findOneByEmailOrThrow(email: string): Promise<AdminEntity>;
  isExist(email: string): Promise<boolean>;
}
