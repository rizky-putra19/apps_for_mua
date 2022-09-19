import { Result } from '@badrap/result';
import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { GetBookingQuery } from '@src/modules/booking/queries/get-booking/get-booking.query';
import { InvoiceRepository } from '../../database/invoice.repository';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { CreateInvoiceCommand } from './create-invoice.command';

@Controller({
  path: '/invoices',
  version: '1',
})
export class CreateInvoiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get()
  async index() {
    const booking: Result<BookingEntity> = await this.queryBus.execute(
      new GetBookingQuery({
        bookingID: 'f2902b15-fcb3-43fe-9df2-492d3595d7ae',
      }),
    );
    const result: Result<InvoiceEntity> = await this.commandBus.execute(
      new CreateInvoiceCommand({
        booking: booking.unwrap(),
      }),
    );

    return new DataResponseBase(result.unwrap());
  }
}
