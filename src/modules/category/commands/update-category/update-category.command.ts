import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { CategoryStatus } from '../../domain/enums/category-status.enum';

export class UpdateCategoryCommand extends Command {
  readonly id: number;
  readonly parentId?: number;
  readonly name: string;
  readonly status: CategoryStatus;
  constructor(props: CommandProps<UpdateCategoryCommand>) {
    super(props);
    this.id = props.id;
    this.parentId = props.parentId;
    this.name = props.name;
    this.status = props.status;
  }
}
