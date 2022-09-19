import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';

export class CreateCategoryCommand extends Command {
  readonly parentId?: number;
  readonly name: string;
  constructor(props: CommandProps<CreateCategoryCommand>) {
    super(props);
    this.parentId = props.parentId;
    this.name = props.name;
  }
}
