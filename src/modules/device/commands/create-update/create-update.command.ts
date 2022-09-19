import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';

export class CreateUpdateCommand extends Command {
  readonly pushToken: string;
  readonly deviceId: string;
  readonly platform: string;
  readonly user?: UserEntity;
  readonly type: UserType;
  constructor(props: CommandProps<CreateUpdateCommand>) {
    super(props);
    this.pushToken = props.pushToken;
    this.deviceId = props.deviceId;
    this.user = props.user;
    this.platform = props.platform;
    this.type = props.type;
  }
}
