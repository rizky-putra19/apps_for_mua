import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { CustomAuthGuard } from '@src/infrastructure/guards/custom.guard';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { BookingServiceEntity } from '../../domain/entities/booking-service.entity';
import { BookingVenueEntity } from '../../domain/entities/booking-venue.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { CreateBookingCommand } from './create-booking.command';
import { CreateBookingRequest } from './create-booking.request';

@Controller({
  version: '1',
  path: '/bookings',
})
export class BookingHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard('custom'))
  async create(
    @Body() request: CreateBookingRequest,
    @User() user: UserEntity,
  ) {
    const { venue, services, eventDate, eventName, name } = request;
    const result: Result<BookingEntity> = await this.commandBus.execute(
      new CreateBookingCommand({
        name: name,
        customer: user,
        eventDate,
        venue,
        eventName,
        services,
      }),
    );

    return new DataResponseBase(
      result.unwrap((r) => new IdResponse(r.id.value)),
    );
  }
}
