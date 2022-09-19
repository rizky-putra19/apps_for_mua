import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { CreateReasonCommand } from './create-reason.command';
import { CreateReasonRequest } from './create-reason.request';
import { Result } from '@badrap/result';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';

@Controller({
  version: '1',
  path: '/reasons',
})
export class ReasonHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() body: CreateReasonRequest) {
    const command = new CreateReasonCommand({
      reason: body.reason,
      description: body.description,
      type: body.type,
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
