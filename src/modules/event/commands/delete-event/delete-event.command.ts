import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class DeleteEventCommand extends Command {
  readonly eventId: ID;
  constructor(props: CommandProps<DeleteEventCommand>) {
    super(props);
    this.eventId = props.eventId;
  }
}
