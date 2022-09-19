import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class CreateWalletCommand extends Command {
  readonly user: UserEntity;
  constructor(props: CommandProps<CreateWalletCommand>) {
    super(props);
    this.user = props.user;
  }
}
