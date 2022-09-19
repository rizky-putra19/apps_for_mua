import { Result } from '@badrap/result';
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { EditorChoiceResponse } from '../../dtos/editor-choice.dto';
import { RemoveEditorChoiceCommand } from './remove-editor-choice.command-handler';

@Controller({
  version: '1',
  path: '/editor-choice',
})
@UseGuards(AuthGuard('custom'))
export class RemoveEditorChoiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('/:id')
  async remove(@Param('id') id: number, @User() user: UserEntity) {
    const command = new RemoveEditorChoiceCommand({
      id,
      user,
    });

    const result: Result<EditorChoiceEntity, Error> =
      await this.commandBus.execute(command);

    return new DataResponseBase(
      result.unwrap((e) => new EditorChoiceResponse(e)),
    );
  }
}
