import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { BookingNotFound } from '../../errors/booking.errors';
import { UpdateBookingStatusCommand } from '../update-booking-status/update-booking-status.command';
import { Result } from '@badrap/result';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';

@Controller({
  version: '1',
  path: '/internal-bookings',
})
export class InternalUpdateBookingStatusHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('/:bookingID/:bookingStatus')
  async internalUpdateStatus(
    @Param('bookingID') bookingID: string,
    @Param('bookingStatus') bookingStatus: BookingStatus,
  ) {
    const command = new UpdateBookingStatusCommand({
      id: bookingID,
      bookingStatus: bookingStatus,
    });

    const result: Result<BookingEntity, BookingNotFound> =
      await this.commandBus.execute(command);

    return new DataResponseBase(
      result.unwrap((b) => new IdResponse(b.id.value)),
    );
  }
}
