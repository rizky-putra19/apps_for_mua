import { Provider } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateInvoiceEventWhenBookingIsConfirmedEventHandler } from './application/event-listener/create-invoice.event-handler';

export const createInvoiceEventWhenBookingIsConfirmedEventHandler: Provider = {
  provide: CreateInvoiceEventWhenBookingIsConfirmedEventHandler,
  useFactory: (commandBus: CommandBus, queryBus: QueryBus) => {
    const handler = new CreateInvoiceEventWhenBookingIsConfirmedEventHandler(
      commandBus,
      queryBus,
    );

    // handler.listen();
    return handler;
  },
  inject: [CommandBus, QueryBus],
};
