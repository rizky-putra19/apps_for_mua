import { Get, UseGuards, Controller, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingNotFound } from '../../errors/booking.errors';
import { GetBookingQuery } from './get-booking.query';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { BookingDetailResponse } from '../../dtos/booking-detail.response.dto';

@Controller({
  version: '1',
  path: '/bookings',
})
export class GetBookingHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:bookingID')
  @UseGuards(AuthGuard('custom'))
  async showDetail(
    @Param('bookingID') bookingID: string,
    @User() user: UserEntity,
  ): Promise<DataResponseBase<BookingDetailResponse, BookingNotFound>> {
    const query = new GetBookingQuery({
      bookingID: bookingID,
      user: user,
    });
    const result: Result<BookingEntity, BookingNotFound> =
      await this.queryBus.execute(query);
    return new DataResponseBase(
      result.unwrap((b) => new BookingDetailResponse(b)),
    );
  }
}
