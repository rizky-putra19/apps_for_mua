import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class RemoveEditorChoiceCommand extends Command {
  readonly id: number;
  readonly user: UserEntity;
  constructor(props: CommandProps<RemoveEditorChoiceCommand>) {
    super(props);
    this.id = props.id;
    this.user = props.user;
  }
}
