import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import Xendit from 'xendit-node';
import { HandleCallbackCommandHandler } from './commands/handle-callback/handle-callback.command-handler';
import { HandleCallbackHttpController } from './commands/handle-callback/handle-callback.http-controller';
import { PaymentProvider } from './commands/handle-callback/providers/payment-provider.interface';
import { XenditProvider } from './commands/handle-callback/providers/xendit.provider';
import { PaymentOrmEntity } from './database/payment.orm-entity';
import { PaymentProviderEnum } from './domain/enum/payment-provider.enum';
const xendit = {
  provide: Xendit,
  useFactory: (configService: ConfigService) => {
    return new Xendit({
      secretKey: configService.get('payments.providers.xendit.secretKey'),
    });
  },
  inject: [ConfigService],
};

const callbackHandlerMap: Provider = {
  provide: 'CALLBACK_HANDLER',
  useFactory: (xenditProvider: XenditProvider) => {
    const map = new Map<PaymentProviderEnum, PaymentProvider>();
    map.set(PaymentProviderEnum.XENDIT, xenditProvider);
    return map;
  },
  inject: [XenditProvider],
};
@Module({
  imports: [TypeOrmModule.forFeature([PaymentOrmEntity]), CqrsModule],
  controllers: [HandleCallbackHttpController],
  providers: [
    xendit,
    XenditProvider,
    callbackHandlerMap,
    HandleCallbackCommandHandler,
  ],
  exports: [xendit],
})
export class PaymentModule {}
