import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import {
  ApiClientEntity,
  ApiClientProps,
} from '../domain/entities/api-client.entity';
import { ApiClientOrmEntity } from './api-client-orm-entity';

export class ApiClientOrmMapper extends OrmMapper<
  ApiClientEntity,
  ApiClientOrmEntity
> {
  protected toDomainProps(
    ormEntity: ApiClientOrmEntity,
  ): EntityProps<ApiClientProps> {
    const id = new UUID(ormEntity.id);
    const props: ApiClientProps = {
      grantType: ormEntity.grantTypes,
      secret: ormEntity.secret,
    };
    return {
      id,
      props,
    };
  }
  protected toOrmProps(
    entity: ApiClientEntity,
  ): OrmEntityProps<ApiClientOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      grantTypes: props.grantType,
      secret: props.secret,
    };
  }
}
