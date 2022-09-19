import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command-base';
import { PaymentProviderEnum } from '../../domain/enum/payment-provider.enum';

export class HandleCallbackCommand extends Command {
  readonly body: any;
  readonly headers: any;
  readonly provider: PaymentProviderEnum;
  constructor(props: CommandProps<HandleCallbackCommand>) {
    super(props);
    this.body = props.body;
    this.headers = props.headers;
    this.provider = props.provider;
  }
}
