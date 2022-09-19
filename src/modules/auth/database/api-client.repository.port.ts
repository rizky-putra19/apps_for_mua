import { RepositoryPort } from '@src/libs/ddd/domain/ports/repository.ports';
import {
  ApiClientEntity,
  ApiClientProps,
} from '../domain/entities/api-client.entity';
import { ApiClientOrmEntity } from './api-client-orm-entity';

export interface ApiClientRepositoryPort
  extends RepositoryPort<ApiClientEntity, ApiClientProps, ApiClientOrmEntity> {}
