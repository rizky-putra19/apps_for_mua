import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { CreateReportIssueRequest } from './create-report-issue.request';

export class CreateReportIssueCommand extends Command {
  readonly user: UserEntity;
  readonly issue: CreateReportIssueRequest;
  constructor(props: CommandProps<CreateReportIssueCommand>) {
    super(props);
    this.user = props.user;
    this.issue = props.issue;
  }
}
