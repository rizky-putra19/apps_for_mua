import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';

export class UpdateFinanceCommand extends Command {
  readonly id?: string;
  readonly targetBank?: string;
  readonly targetBankAccountName?: string;
  readonly targetBankAccountNumber?: string;
  readonly financeStatus?: string;
  constructor(props: CommandProps<UpdateFinanceCommand>) {
    super(props);
    this.id = props.id;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeStatus = props.financeStatus;
  }
}
