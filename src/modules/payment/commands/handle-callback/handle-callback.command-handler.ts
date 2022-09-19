import { Result } from '@badrap/result';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { InvoiceEntity } from '@src/modules/invoice/domain/entities/invoice.entity';
import Xendit from 'xendit-node';
import { PaymentEntity } from '../../domain/entities/payment-entity';
import { PaymentProviderEnum } from '../../domain/enum/payment-provider.enum';
import { HandleCallbackCommand } from './handle-callback.command';
import { PaymentProvider } from './providers/payment-provider.interface';

@CommandHandler(HandleCallbackCommand)
export class HandleCallbackCommandHandler extends CommandHandlerBase {
  constructor(
    readonly unitOfWOrk: UnitOfWork,
    @Inject('CALLBACK_HANDLER')
    private readonly callbackHandler: Map<PaymentProviderEnum, PaymentProvider>,
    private readonly xendit: Xendit,
  ) {
    super(unitOfWOrk);
  }
  async handle(
    command: HandleCallbackCommand,
  ): Promise<Result<PaymentEntity, Error>> {
    const { body, headers, provider } = command;
    const { Invoice } = this.xendit;
    const i = new Invoice({});
    const inv = await i.getInvoice({
      invoiceID: body.id,
    });
    const handler = this.callbackHandler.get(provider);
    const result: InvoiceEntity = await handler.handle(
      inv,
      headers,
      command.correlationId,
    );

    return Result.ok(result.getPropsCopy().payment);
  }
}
