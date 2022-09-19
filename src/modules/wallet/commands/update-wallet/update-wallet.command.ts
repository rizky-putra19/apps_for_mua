import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { WalletHistoryEntity } from '../../domain/entities/wallet-history.entity';

export class UpdateWalletCommand extends Command {
  readonly artisanID: string;
  readonly currentBalance?: number;
  readonly onHold?: number;
  readonly ready?: number;
  readonly histories?: WalletHistoryEntity[];

  constructor(props: CommandProps<UpdateWalletCommand>) {
    super(props);
    this.artisanID = props.artisanID;
    this.currentBalance = props.currentBalance;
    this.onHold = props.onHold;
    this.ready = props.ready;
    this.histories = props.histories;
  }
}
