import { Result } from '@badrap/result';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '@src/infrastructure/decorators';
import { CustomAuthGuard } from '@src/infrastructure/guards/custom.guard';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingDetailResponse } from '../../dtos/booking-detail.response.dto';
import { BookingResponse } from '../../dtos/booking.dto';
import { FindBookingQuery } from './find-booking.query';
import { FindBookingQueryParams } from './find-booking.query-params.dto';

@Controller({
  version: '1',
  path: '/bookings',
})
export class FindBookingDashboardHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/dashboard')
  @UseGuards(CustomAuthGuard)
  async showAdmin(
    @User() user: UserEntity,
    @Query() params: FindBookingQueryParams,
  ) {
    const result: Result<DataWithPaginationMeta<BookingEntity[]>> =
      await this.queryBus.execute(new FindBookingQuery({ params, user }));

    return result.unwrap((r) => {
      const { count, data, limit, page } = r;
      return new DataListResponseBase(
        data.map((d) => new BookingDetailResponse(d)),
        { count, limit, page },
      );
    });
  }
}
