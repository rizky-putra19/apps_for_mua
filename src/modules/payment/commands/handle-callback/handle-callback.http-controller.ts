import { Result } from '@badrap/result';
import {
  Body,
  Controller,
  Header,
  Headers,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { PaymentEntity } from '../../domain/entities/payment-entity';
import { PaymentProviderEnum } from '../../domain/enum/payment-provider.enum';
import { HandleCallbackCommand } from './handle-callback.command';

@Controller({
  path: '/payment/callback',
})
export class HandleCallbackHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/:provider')
  async handleProvider(
    @Param('provider') provider: string,
    @Headers() headers: any,
    @Body() body: any,
  ) {
    const result: Result<PaymentEntity> = await this.commandBus.execute(
      new HandleCallbackCommand({
        body,
        headers,
        provider: PaymentProviderEnum[provider.toUpperCase()],
      }),
    );

    return {
      ok: 'message',
    };
  }
}
