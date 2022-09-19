import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { ReasonType } from '../../domain/enums/reason-type.enum';

export class CreateReasonCommand extends Command {
  readonly reason: string;
  readonly description: string;
  readonly type: ReasonType;
  constructor(props: CommandProps<CreateReasonCommand>) {
    super(props);
    this.reason = props.reason;
    this.description = props.description;
    this.type = props.type;
  }
}
