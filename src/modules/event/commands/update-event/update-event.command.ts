import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UpdateEventRequest } from './update-event.request';

export class UpdateEventCommand extends Command {
  readonly eventId: ID;
  readonly request: UpdateEventRequest;
  constructor(props: CommandProps<UpdateEventCommand>) {
    super(props);
    this.eventId = props.eventId;
    this.request = props.request;
  }
}
