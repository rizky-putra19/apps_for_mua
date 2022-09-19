import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingNotFound } from '../../errors/booking.errors';
import { UpdateBookingStatusCommand } from './update-booking-status.command';
import { UpdateBookingStatusRequest } from './update-booking-status.request';
import { Result } from '@badrap/result';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

@Controller({
  version: '1',
  path: '/bookings',
})
@UseGuards(AuthGuard('custom'))
export class UpdateBookingStatusHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:bookingID/:bookingStatus')
  async updateStatus(
    @Param('bookingID') bookingID: string,
    @Param('bookingStatus') bookingStatus: BookingStatus,
    @Body() body: UpdateBookingStatusRequest,
    @User() user: UserEntity,
  ) {
    const command = new UpdateBookingStatusCommand({
      id: bookingID,
      bookingStatus: bookingStatus,
      user,
      body,
    });

    const result: Result<BookingEntity, BookingNotFound> =
      await this.commandBus.execute(command);
    return new DataResponseBase(
      result.unwrap((b) => new IdResponse(b.id.value)),
    );
  }
}
