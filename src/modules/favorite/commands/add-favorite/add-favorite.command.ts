import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class AddFavoriteCommand extends Command {
  readonly artisanID: string;
  readonly user: UserEntity;
  constructor(props: CommandProps<AddFavoriteCommand>) {
    super(props);
    this.artisanID = props.artisanID;
    this.user = props.user;
  }
}
