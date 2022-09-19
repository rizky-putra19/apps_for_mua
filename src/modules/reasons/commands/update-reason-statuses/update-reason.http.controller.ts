import { Result } from '@badrap/result';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { UpdateReasonCommand } from './update-reason.command';
import { UpdateReasonRequest } from './update-reason.request';

@Controller({
  version: '1',
  path: '/reasons',
})
export class UpdateReasonHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateReasonRequest) {
    const command = new UpdateReasonCommand({
      reason: body.reason,
      description: body.description,
      type: body.type,
      id,
    });
    const result: Result<ReasonEntity> = await this.commandBus.execute(command);

    return result.unwrap(
      (r) => new DataResponseBase(r),
      (error) => {
        throw error;
      },
    );
  }
}
