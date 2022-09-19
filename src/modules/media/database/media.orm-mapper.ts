import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { MediaEntity, MediaProps } from '../domain/entities/media.entity';
import { MediaOrmEntity } from './media.orm-entity';

export class MediaOrmMapper extends OrmMapper<MediaEntity, MediaOrmEntity> {
  protected toDomainProps(ormEntity: MediaOrmEntity): EntityProps<MediaProps> {
    const id = new UUID(ormEntity.id);
    return {
      id,
      props: {
        filename: ormEntity.filename,
        mediaType: ormEntity.mediaType,
        type: ormEntity.type,
        uploaded: ormEntity.uploaded,
        typeId: ormEntity.typeId,
        url: ormEntity.url,
      },
    };
  }
  protected toOrmProps(entity: MediaEntity): OrmEntityProps<MediaOrmEntity> {
    const props = entity.getPropsCopy();
    return {
      filename: props.filename,
      mediaType: props.mediaType,
      type: props.type,
      uploaded: props.uploaded,
      typeId: props.typeId,
      url: props.url,
    };
  }

  static convertToOrmEntity(entity: MediaEntity): MediaOrmEntity {
    const mapper = new MediaOrmMapper(MediaEntity, MediaOrmEntity);
    return entity != null ? mapper.toOrmEntity(entity) : null;
  }
  static convertToDomainEntity(entity: MediaOrmEntity): MediaEntity {
    const mapper = new MediaOrmMapper(MediaEntity, MediaOrmEntity);
    return entity != null ? mapper.toDomainEntity(entity) : null;
  }
}
