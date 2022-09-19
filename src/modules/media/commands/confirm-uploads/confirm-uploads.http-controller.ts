import { Result } from '@badrap/result';
import { Body, Controller, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { MediaEntity } from '../../domain/entities/media.entity';
import { ConfirmUploadHttpRequest } from '../confirm-upload/confirm-upload.dto';
import { MediaResponse } from '../dtos/media.response.dto';
import { ConfirmUploadsCommand } from './confirm-uploads.command';

@Controller({
  version: '1',
  path: '/media',
})
export class ConfirmUploadsHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/confirms')
  async confirmUploads(@Body() request: ConfirmUploadHttpRequest[]) {
    const result: Result<MediaEntity[]> = await this.commandBus.execute(
      new ConfirmUploadsCommand({
        request,
      }),
    );

    return result.unwrap((r) => {
      return new DataListResponseBase(r.map((m) => new MediaResponse(m)));
    });
  }
}
