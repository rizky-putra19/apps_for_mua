import { Result } from '@badrap/result';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { ProcessCodeResponse } from '../../dtos/booking.dto';
import { BookingNotFound } from '../../errors/booking.errors';
import { GetProcessCodeQuery } from './get-process-code.query';

@Controller({
  version: '1',
  path: '/bookings',
})
export class GetProcessCodeHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/process-code/:bookingID')
  @UseGuards(AuthGuard('custom'))
  async show(
    @Param('bookingID') bookingID: string,
    @User() user: UserEntity,
  ): Promise<DataResponseBase<ProcessCodeResponse, BookingNotFound>> {
    const result: Result<BookingEntity, BookingNotFound> =
      await this.queryBus.execute(
        new GetProcessCodeQuery({
          bookingID,
          user,
        }),
      );

    return new DataResponseBase(
      result.unwrap((c) => new ProcessCodeResponse(c)),
    );
  }
}
