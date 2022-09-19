import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

export class RegisterUserCommand extends Command {
  constructor(props: CommandProps<RegisterUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.type = props.type;
    this.facebookId = props.facebookId;
    this.googleId = props.googleId;
    this.gender = props.gender;
    this.appleId = props.appleId;
    this.challengeToken = props.challengeToken;
    this.birthdate = props.birthdate;
    this.username = props.username;
    this.categories = props.categories;
    this.instagram = props.instagram;
  }
  readonly email: Email;
  readonly password: string;
  readonly name?: string;
  readonly type: UserType;
  readonly facebookId?: string;
  readonly googleId?: string;
  readonly gender: string;
  readonly appleId?: string;
  readonly challengeToken: string;
  readonly categories?: number[];
  readonly instagram?: string;
  readonly birthdate?: Date;
  readonly username?: string;
}
