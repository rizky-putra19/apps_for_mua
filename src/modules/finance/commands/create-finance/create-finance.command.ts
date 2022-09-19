import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

export class CreateFinanceCommand extends Command {
  readonly user: UserEntity;
  readonly bookingCode: string;
  readonly amount: number;
  readonly targetBank?: string;
  readonly targetBankAccountName?: string;
  readonly targetBankAccountNumber?: string;
  readonly financeType: string;
  constructor(props: CommandProps<CreateFinanceCommand>) {
    super(props);
    this.user = props.user;
    this.bookingCode = props.bookingCode;
    this.amount = props.amount;
    this.targetBank = props.targetBank;
    this.targetBankAccountName = props.targetBankAccountName;
    this.targetBankAccountNumber = props.targetBankAccountNumber;
    this.financeType = props.financeType;
  }
}
