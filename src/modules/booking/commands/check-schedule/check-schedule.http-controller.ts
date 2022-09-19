import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingResponse } from '../../dtos/booking.dto';
import { CheckScheduleCommand } from './check-schedule.command';
import { CheckScheduleRequest } from './check-schedule.request';

@Controller({
  version: '1',
  path: '/bookings',
})
export class CheckScheduleHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/check-schedule')
  @UseGuards(AuthGuard('custom'))
  async check(@Body() request: CheckScheduleRequest, @User() user: UserEntity) {
    const { artisanId, month } = request;
    const command = new CheckScheduleCommand({
      user,
      artisanId,
      month,
    });

    const result: Result<DataAndCountMeta<BookingEntity[]>> =
      await this.commandBus.execute(command);

    return result.unwrap((r) => {
      const { count, data } = r;
      return new DataListResponseBase(
        data.map((d) => new BookingResponse(d)),
        { count },
      );
    });
  }
}
