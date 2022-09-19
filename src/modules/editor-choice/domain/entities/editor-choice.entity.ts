import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditorChoiceOrmEntity } from '../../database/editor-choice.orm-entity';

export interface CreateEditorChoiceProps {
  id?: number;
  artisan: UserEntity;
}

export interface EditorChoiceProps extends CreateEditorChoiceProps {
  editorChoice?: boolean;
}

export class EditorChoiceEntity implements EditorChoiceProps {
  id?: number;
  artisan: UserEntity;
  editorChoice?: boolean;

  constructor(props: EditorChoiceEntity) {
    this.id = props.id;
    this.artisan = props.artisan;
    this.editorChoice = props.editorChoice;
  }

  static create(request: CreateEditorChoiceProps): EditorChoiceEntity {
    const editorChoiceEntity = new EditorChoiceEntity({
      artisan: request.artisan,
    });
    return editorChoiceEntity;
  }

  static convertToDomainEntity(
    editorChoiceOrmEntity: EditorChoiceOrmEntity,
  ): EditorChoiceEntity {
    return new EditorChoiceEntity({
      id: editorChoiceOrmEntity.id,
      artisan: UserOrmMapper.convertToDomainEntity(
        editorChoiceOrmEntity.artisan,
      ),
    });
  }

  static convertToOrmEntity(entity: EditorChoiceEntity): EditorChoiceOrmEntity {
    const ormEntity = new EditorChoiceOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entity.artisan);
    return ormEntity;
  }
}
