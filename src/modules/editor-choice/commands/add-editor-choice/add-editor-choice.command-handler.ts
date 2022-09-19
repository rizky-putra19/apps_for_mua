import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { EditorChoiceRepository } from '../../database/editor-choice.repository';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { AddEditorChoiceCommand } from './add-editor-choice.command';

@CommandHandler(AddEditorChoiceCommand)
export class AddEditorChoiceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly editorChoiceRepository: EditorChoiceRepository,
    protected readonly userRepository: UserRepository,
  ) {
    super(unitOfWork);
  }

  async handle(
    command: AddEditorChoiceCommand,
  ): Promise<Result<EditorChoiceEntity, Error>> {
    try {
      const { artisanID, user } = command;

      // only admin allow
      if (
        user.getPropsCopy().type == 'artisan' ||
        user.getPropsCopy().type == 'customer'
      ) {
        throw new BadRequestException('only admin');
      }

      // check if exist
      const found = await this.editorChoiceRepository.exist(artisanID);
      if (found) {
        throw new BadRequestException('already exist');
      }

      const artisan = await this.userRepository.findById(artisanID);

      // check for verified artisan
      if (artisan.getPropsCopy().status != 'active') {
        throw new BadRequestException('only verified artisan');
      }

      const addEditorChoiceEntity = EditorChoiceEntity.create({
        artisan,
      });

      const added = await this.editorChoiceRepository.save(
        addEditorChoiceEntity,
      );

      return Result.ok(added);
    } catch (error) {
      return Result.err(error);
    }
  }
}
