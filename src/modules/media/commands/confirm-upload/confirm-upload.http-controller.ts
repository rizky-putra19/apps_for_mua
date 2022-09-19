import { Result } from '@badrap/result';
import { Body, Controller, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { MediaEntity } from '../../domain/entities/media.entity';
import { MediaResponse } from '../dtos/media.response.dto';
import { ConfirmUploadCommand } from './confirm-upload.command';
import { ConfirmUploadHttpRequest } from './confirm-upload.dto';

@Controller({
  version: '1',
  path: '/media',
})
export class ConfirmUploadHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/confirm')
  async confirmUpload(@Body() request: ConfirmUploadHttpRequest) {
    const result: Result<MediaEntity> = await this.commandBus.execute(
      new ConfirmUploadCommand({
        filename: request.filename,
        typeId: request.typeId,
      }),
    );

    return new DataResponseBase(result.unwrap((m) => new MediaResponse(m)));
  }
}
