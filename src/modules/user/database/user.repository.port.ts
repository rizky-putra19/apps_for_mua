import { RepositoryPort } from '@src/libs/ddd/domain/ports/repository.ports';
import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export interface UserRepositoryPort
  extends RepositoryPort<UserEntity, UserProps, UserOrmEntity> {
  findOneByEmailOrThrow(email: string): Promise<UserEntity>;
  exists(email: string, type: string): Promise<boolean>;
}
