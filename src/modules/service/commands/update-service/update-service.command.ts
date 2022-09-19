import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UpdateServiceRequest } from './update-service.request';

export class UpdateServiceCommand extends Command {
  readonly serviceID: string;
  readonly user: UserEntity;
  readonly service: UpdateServiceRequest;
  constructor(props: CommandProps<UpdateServiceCommand>) {
    super(props);
    this.serviceID = props.serviceID;
    this.user = props.user;
    this.service = props.service;
  }
}
