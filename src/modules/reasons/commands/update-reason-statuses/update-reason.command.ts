import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { ReasonType } from '../../domain/enums/reason-type.enum';

export class UpdateReasonCommand extends Command {
  readonly id: number;
  readonly reason: string;
  readonly description: string;
  readonly type: ReasonType;
  constructor(props: CommandProps<UpdateReasonCommand>) {
    super(props);
    this.id = props.id;
    this.reason = props.reason;
    this.description = props.description;
    this.type = props.type;
  }
}
