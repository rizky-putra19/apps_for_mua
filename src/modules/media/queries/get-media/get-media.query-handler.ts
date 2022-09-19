import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { MediaRepository } from '../../database/media.repository';
import { MediaEntity } from '../../domain/entities/media.entity';
import { GetMediaQuery } from './get-media.query';

@QueryHandler(GetMediaQuery)
export class GetMediaQueryHandler extends QueryHandlerBase {
  constructor(private readonly mediaRepo: MediaRepository) {
    super();
  }
  async handle(query: GetMediaQuery): Promise<Result<MediaEntity, Error>> {
    const mediaEntity = await this.mediaRepo.findOneRaw({
      where: {
        type: query.type,
        mediaType: query.mediaType,
        typeId: query.typeId,
      },
    });
    if (mediaEntity == undefined) {
      return Result.err();
    }

    return Result.ok(mediaEntity);
  }
}
