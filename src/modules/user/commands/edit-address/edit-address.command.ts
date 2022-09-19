import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditAddressRequest } from './edit-address.request';

export class EditAddressCommand extends Command {
  readonly id: number;
  readonly user: UserEntity;
  readonly address: EditAddressRequest;

  constructor(props: CommandProps<EditAddressCommand>) {
    super(props);
    this.id = props.id;
    this.user = props.user;
    this.address = props.address;
  }
}
