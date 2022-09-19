import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';

export class ConfirmUploadCommand extends Command {
  readonly filename: string;
  readonly typeId: string;
  constructor(props: CommandProps<ConfirmUploadCommand>) {
    super(props);
    this.filename = props.filename;
    this.typeId = props.typeId;
  }
}
