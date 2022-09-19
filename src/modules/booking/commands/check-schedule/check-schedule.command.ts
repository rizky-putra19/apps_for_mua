import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class CheckScheduleCommand extends Command {
  readonly user: UserEntity;
  readonly artisanId: string;
  readonly month: number;
  constructor(props: CommandProps<CheckScheduleCommand>) {
    super(props);
    this.user = props.user;
    this.artisanId = props.artisanId;
    this.month = props.month;
  }
}
