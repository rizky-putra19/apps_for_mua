import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MediaType } from '../../domain/enums/media-type.enum';
import { CreateMediaCommand } from './create-media.command';
import * as mimeTypes from 'mime-types';
import { CreateMediaRequest } from './create-media.dto';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { Result } from '@badrap/result';
import { MediaEntity } from '../../domain/entities/media.entity';

@Controller({
  version: '1',
  path: '/media',
})
export class CreateMediaHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('/:mediaType/:type')
  async createMedia(
    @Param('mediaType') mediaType: string,
    @Param('type') type: string,
    @Body() requestBody: CreateMediaRequest,
  ) {
    const result: Result<any> = await this.commandBus.execute(
      new CreateMediaCommand({
        mediaType: MediaType[mediaType.toUpperCase()],
        type: type,
        mimeType: requestBody.mimeType,
      }),
    );
    return new DataResponseBase(
      result.unwrap((r) => ({
        filename: r.filename,
        url: r.url,
      })),
    );
  }
}
