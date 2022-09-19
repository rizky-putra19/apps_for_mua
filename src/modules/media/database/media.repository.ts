import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import { QueryParams } from '@src/libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { Repository } from 'typeorm';
import { MediaEntity, MediaProps } from '../domain/entities/media.entity';
import { MediaOrmEntity } from './media.orm-entity';
import { MediaOrmMapper } from './media.orm-mapper';

@Injectable()
export class MediaRepository extends TypeormRepositoryBase<
  MediaEntity,
  MediaProps,
  MediaOrmEntity
> {
  protected relations: string[];
  constructor(
    @InjectRepository(MediaOrmEntity)
    readonly mediaRepository: Repository<MediaOrmEntity>,
  ) {
    super(
      mediaRepository,
      new MediaOrmMapper(MediaEntity, MediaOrmEntity),
      new Logger('MediaRepository'),
    );
  }

  async getMediaByTypeAndTypeId(
    typeId: string,
    type: string,
    mediaType: string = 'image',
  ): Promise<MediaOrmEntity> {
    return this.repository.findOne({
      where: {
        type: type,
        mediaType: mediaType,
        typeId: typeId,
      },
    });
  }

  async getAllMediaByTypeAndTypeId(
    typeId: string,
    type: string,
    mediaType: string = 'image',
  ): Promise<MediaOrmEntity[]> {
    return this.repository.find({
      where: {
        type: type,
        mediaType: mediaType,
        typeId: typeId,
      },
    });
  }

  protected prepareQuery(
    params: DeepPartial<MediaProps>,
  ): WhereCondition<MediaOrmEntity> {
    const where: QueryParams<MediaOrmEntity> = {};
    if (params.filename) {
      where.filename = params.filename;
    }
    return where;
  }
}
