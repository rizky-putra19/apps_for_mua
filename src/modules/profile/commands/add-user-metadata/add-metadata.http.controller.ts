import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { AddMetadataRequest } from '../../../user/commands/add-user-metadata/add-user-metadata.request';
import { AddMetadataCommand } from '@src/modules/user/commands/add-user-metadata/add-user-metadata.command';

@Controller({
  version: '1',
  path: '/profile',
})
@UseGuards(AuthGuard('custom'))
export class AddMetadataHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('metadata')
  async create(@User() user: UserEntity, @Body() request: AddMetadataRequest) {
    const command = new AddMetadataCommand({
      user,
      metadata: request,
    });
    const result: Result<UserEntity> = await this.commandBus.execute(command);

    return new DataResponseBase(result.unwrap((u) => new UserResponse(u)));
  }
}
