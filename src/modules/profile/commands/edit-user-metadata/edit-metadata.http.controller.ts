import { Result } from '@badrap/result';
import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { EditMetadataCommand } from '@src/modules/user/commands/edit-user-metadata/edit-user-metadata.command';
import { EditMetadataRequest } from '@src/modules/user/commands/edit-user-metadata/edit-user-metadata.request';
import { UserMetadataEntity } from '@src/modules/user/domain/entities/user-metadata';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';

@Controller({
  version: '1',
  path: '/profile',
})
@UseGuards(AuthGuard('custom'))
export class EditMetadataHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('metadata')
  async edit(@User() user: UserEntity, @Body() request: EditMetadataRequest) {
    const command = new EditMetadataCommand({
      user,
      metadata: request,
    });
    const result: Result<UserEntity> = await this.commandBus.execute(command);

    return new DataResponseBase(result.unwrap((u) => new UserResponse(u)));
  }
}
