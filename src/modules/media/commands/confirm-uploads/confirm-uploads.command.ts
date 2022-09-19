import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { ConfirmUploadHttpRequest } from '../confirm-upload/confirm-upload.dto';

export class ConfirmUploadsCommand extends Command {
  readonly request: ConfirmUploadHttpRequest[];
  constructor(props: CommandProps<ConfirmUploadsCommand>) {
    super(props);
    this.request = props.request;
  }
}
