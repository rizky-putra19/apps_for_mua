import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { CategoryStatus } from '../../domain/enums/category-status.enum';

export class UpdateCategoryStatusCommand extends Command {
  readonly id: number;
  readonly status: CategoryStatus;
  constructor(props: CommandProps<UpdateCategoryStatusCommand>) {
    super(props);
    this.id = props.id;
    this.status = props.status;
  }
}
