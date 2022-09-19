import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class DeleteServiceCommand extends Command {
  readonly serviceID: string;
  readonly user: UserEntity;
  constructor(props: CommandProps<DeleteServiceCommand>) {
    super(props);
    this.serviceID = props.serviceID;
    this.user = props.user;
  }
}
