import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { EditMetadataRequest } from './edit-user-metadata.request';

export class EditMetadataCommand extends Command {
  readonly user: UserEntity;
  readonly metadata: EditMetadataRequest;

  constructor(props: CommandProps<EditMetadataCommand>) {
    super(props);
    this.user = props.user;
    this.metadata = props.metadata;
  }
}
