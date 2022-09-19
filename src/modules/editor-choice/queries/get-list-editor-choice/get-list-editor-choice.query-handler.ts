import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { EditorChoiceRepository } from '../../database/editor-choice.repository';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { GetListEditorChoiceQuery } from './get-list-editor-choice.query';

@QueryHandler(GetListEditorChoiceQuery)
export class GetListEditorChoiceQueryHandler extends QueryHandlerBase {
  constructor(private readonly editorChoiceRepository: EditorChoiceRepository) {
    super();
  }

  async handle(
    query: GetListEditorChoiceQuery,
  ): Promise<Result<EditorChoiceEntity[], Error>> {
    try {
      const list = await this.editorChoiceRepository.getList();

      return Result.ok(list);
    } catch (error) {
      return Result.err(error);
    }
  }
}
