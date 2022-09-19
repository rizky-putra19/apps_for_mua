import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { EditorChoiceEntity } from '../domain/entities/editor-choice.entity';

export class EditorChoiceResponse {
  id: number;
  artisan: UserResponse;
  constructor(entity: EditorChoiceEntity) {
    this.id = entity.id;
    this.artisan = new UserResponse(entity.artisan);
  }
}
