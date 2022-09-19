import {
  CommandProps,
  Command,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { CreateAddressRequest } from './add-address.request';

export class AddAddressCommand extends Command {
  readonly user: UserEntity;
  readonly address: CreateAddressRequest;

  constructor(props: CommandProps<AddAddressCommand>) {
    super(props);
    this.user = props.user;
    this.address = props.address;
  }
}
