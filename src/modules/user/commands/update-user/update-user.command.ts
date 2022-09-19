import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserType } from '../../domain/enums/user-type.enum';

export class UpdateUserCommand extends Command {
  readonly id?: string;
  readonly email?: string;
  readonly password?: string;
  readonly name?: string;
  readonly type: UserType;
  readonly facebookId?: string;
  readonly googleId?: string;
  readonly phoneNumber?: string;
  readonly legacyId?: number;
  readonly status: string;
  constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.type = props.type;
    this.facebookId = props.facebookId;
    this.googleId = props.googleId;
    this.phoneNumber = props.phoneNumber;
    this.status = props.status;
  }
}
