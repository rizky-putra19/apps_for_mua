import { Result } from '@badrap/result';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditorChoiceEntity } from '../../domain/entities/editor-choice.entity';
import { EditorChoiceResponse } from '../../dtos/editor-choice.dto';
import { GetListEditorChoiceQuery } from './get-list-editor-choice.query';

@Controller({
  version: '1',
  path: '/editor-choice',
})
export class GetListEditorChoiceHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async show(@User() user: UserEntity) {
    const result: Result<EditorChoiceEntity[]> = await this.queryBus.execute(
      new GetListEditorChoiceQuery(),
    );

    const list = result.unwrap();

    return new DataResponseBase(list.map((d) => new EditorChoiceResponse(d)));
  }
}
