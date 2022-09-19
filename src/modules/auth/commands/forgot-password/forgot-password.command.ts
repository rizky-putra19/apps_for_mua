import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';

export class ForgotPasswordCommand extends Command {
  readonly code: string;
  readonly email: Email;
  readonly newPassword: string;
  constructor(props: CommandProps<ForgotPasswordCommand>) {
    super(props);
    this.code = props.code;
    this.email = props.email;
    this.newPassword = props.newPassword;
  }
}
