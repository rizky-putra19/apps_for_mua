import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { CreateUpdateRequest } from '@src/modules/device/commands/create-update/create-update.request.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { CreateUpdateGeoLocationRequest } from './create-update-geo-location.request.dto';

export class CreateUpdateGeoLocationCommand extends Command {
  readonly user: UserEntity;
  readonly geoLocation: CreateUpdateGeoLocationRequest;
  constructor(props: CommandProps<CreateUpdateGeoLocationCommand>) {
    super(props);
    this.user = props.user;
    this.geoLocation = props.geoLocation;
  }
}
