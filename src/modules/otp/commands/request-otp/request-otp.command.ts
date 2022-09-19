import { Phone } from '@src/infrastructure/domain/value-objects/phone.value-object';
import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { OtpType } from '../../domain/enums/otp-type.enum';

export class RequestOtpCommand extends Command {
  readonly identifier: string;
  readonly userType: UserType;
  readonly type: OtpType;
  constructor(props: CommandProps<RequestOtpCommand>) {
    super(props);
    this.identifier = props.identifier;
    this.userType = props.userType;
    this.type = props.type;
  }
}
