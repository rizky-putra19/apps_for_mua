import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { TypeormEntityBase } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { userInfo } from 'os';
import { Entity } from 'typeorm';
import { MediaType } from '../enums/media-type.enum';
import { MediaUpdatedEvent } from '../events/media-updated.event';

export interface CreateMediaProps {
  filename: string;
  mediaType: MediaType;
  type: string;
}

export interface MediaProps extends CreateMediaProps {
  uploaded: boolean;
  typeId?: string;
  url?: string;
}

export class MediaEntity extends AggregateRoot<MediaProps> {
  protected readonly _id: UUID;

  static create(request: CreateMediaProps): MediaEntity {
    const id = UUID.generate();

    const media = new MediaEntity({
      id,
      props: {
        filename: request.filename,
        mediaType: request.mediaType,
        type: request.type,
        uploaded: false,
      },
    });
    return media;
  }

  static update(id: ID, request: MediaProps): MediaEntity {
    const media = new MediaEntity({
      id,
      props: {
        filename: request.filename,
        mediaType: request.mediaType,
        type: request.type,
        uploaded: true,
      },
    });
    media.addEvent(new MediaUpdatedEvent({ aggregateId: id.value, id }));
    return media;
  }
}
