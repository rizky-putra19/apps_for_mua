import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { EditorChoiceRepository } from '../../database/editor-choice.repository';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { RemoveEditorChoiceCommand } from './remove-editor-choice.command-handler';

@CommandHandler(RemoveEditorChoiceCommand)
export class RemoveEditorChoiceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly editorChoiceRepository: EditorChoiceRepository,
  ) {
    super(unitOfWork);
  }

  async handle(
    command: RemoveEditorChoiceCommand,
  ): Promise<Result<EditorChoiceEntity, Error>> {
    try {
      const { id, user } = command;

      // only admin allow
      if (
        user.getPropsCopy().type == 'artisan' ||
        user.getPropsCopy().type == 'customer'
      ) {
        throw new BadRequestException('only admin');
      }

      const editorChoiceEntity =
        await this.editorChoiceRepository.findOneOrThrow(id);
      await this.editorChoiceRepository.delete(editorChoiceEntity);
      return Result.ok(editorChoiceEntity);
    } catch (error) {
      return Result.err(error);
    }
  }
}
