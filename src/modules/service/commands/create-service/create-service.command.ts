import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { CreateServiceRequest } from './create-service.request';

export class CreateServiceCommand extends Command {
  readonly user: UserEntity;
  readonly service: CreateServiceRequest;
  constructor(props: CommandProps<CreateServiceCommand>) {
    super(props);
    this.user = props.user;
    this.service = props.service;
  }
}
