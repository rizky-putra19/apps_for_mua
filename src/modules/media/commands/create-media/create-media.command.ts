import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { MediaType } from '../../domain/enums/media-type.enum';

export class CreateMediaCommand extends Command {
  readonly type: string;
  readonly mediaType: MediaType;
  readonly mimeType: string;
  constructor(props: CommandProps<CreateMediaCommand>) {
    super(props);
    this.type = props.type;
    this.mediaType = props.mediaType;
    this.mimeType = props.mimeType;
  }
}
