import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { DateVO } from '@src/libs/ddd/domain/value-objects/date.value-object';

export class CreateEventCommand extends Command {
  readonly title: string;
  readonly type: string;
  readonly description: string;
  readonly eventStartAt: DateVO;
  readonly eventEndAt: DateVO;
  readonly status?: string;
  readonly address?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  constructor(props: CommandProps<CreateEventCommand>) {
    super(props);
    this.title = props.title;
    this.type = props.type;
    this.description = props.description;
    this.eventStartAt = props.eventStartAt;
    this.eventEndAt = props.eventEndAt;
    this.address = props.address;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
  }
}
