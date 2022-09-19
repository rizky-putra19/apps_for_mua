import { Result } from '@badrap/result';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { DeleteServiceCommand } from './delete-service.command';

@Controller({
  version: '1',
  path: '/services',
})
export class DeleteServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(AuthGuard('custom'))
  @Delete('/:serviceID')
  async delete(
    @User() user: UserEntity,
    @Param('serviceID') serviceID: string,
  ) {
    const result: Result<ID> = await this.commandBus.execute(
      new DeleteServiceCommand({
        user,
        serviceID,
      }),
    );

    return new DataResponseBase(result.unwrap((s) => new IdResponse(s.value)));
  }
}
