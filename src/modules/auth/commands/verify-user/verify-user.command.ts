import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';

export class VerifyUserCommand extends Command {
  readonly token: string;
  readonly descriptor: string;
  readonly userType: string;
  constructor(props: CommandProps<VerifyUserCommand>) {
    super(props);
    this.token = props.token;
    this.descriptor = props.descriptor;
    this.userType = props.userType;
  }
}
