import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { AddMetadataRequest } from './add-user-metadata.request';

export class AddMetadataCommand extends Command {
  readonly user: UserEntity;
  readonly metadata: AddMetadataRequest;

  constructor(props: CommandProps<AddMetadataCommand>) {
    super(props);
    this.user = props.user;
    this.metadata = props.metadata;
  }
}
