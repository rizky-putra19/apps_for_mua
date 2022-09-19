import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { CreateReviewRequest } from './create-review.request';

export class CreateReviewCommand extends Command {
  readonly user: UserEntity;
  readonly reviews: CreateReviewRequest;
  constructor(props: CommandProps<CreateReviewCommand>) {
    super(props);
    this.user = props.user;
    this.reviews = props.reviews;
  }
}
