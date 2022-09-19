import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { EditorChoiceResponse } from '../../dtos/editor-choice.dto';
import { AddEditorChoiceCommand } from './add-editor-choice.command';
import { AddEditorChoiceRequest } from './add-editor-choice.request';

@Controller({
  version: '1',
  path: '/editor-choice',
})
@UseGuards(AuthGuard('custom'))
export class AddEditorChoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async add(@User() user: UserEntity, @Body() body: AddEditorChoiceRequest) {
    const command = new AddEditorChoiceCommand({
      artisanID: body.artisanID,
      user,
    });

    const result: Result<EditorChoiceEntity, Error> =
      await this.commandBus.execute(command);

    return new DataResponseBase(
      result.unwrap((e) => new EditorChoiceResponse(e)),
    );
  }
}
