import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserType } from '../../domain/enums/user-type.enum';

export class CreateUserCommand extends Command {
  readonly email: string;
  readonly password: string;
  readonly name?: string;
  readonly type: UserType;
  readonly facebookId?: string;
  readonly googleId?: string;
  readonly appleId?: string;
  readonly legacyId?: number;
  readonly status: UserStatus;
  readonly gender: string;
  readonly phoneNumber: string;
  readonly categories?: number[];
  readonly birthdate?: Date;
  readonly username?: string;
  readonly instagram?: string;
  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.type = props.type;
    this.facebookId = props.facebookId;
    this.googleId = props.googleId;
    this.phoneNumber = props.phoneNumber;
    this.status = props.status;
    this.appleId = props.appleId;
    this.gender = props.gender;
    this.categories = props.categories;
    this.birthdate = props.birthdate;
    this.username = props.username;
    this.instagram = props.instagram;
  }
}
