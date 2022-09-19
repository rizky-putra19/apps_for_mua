import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { BookingRepository } from '../../database/booking.repository';
import { GetBookingQuery } from './get-booking.query';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingNotFound } from '../../errors/booking.errors';
import { UnauthorizedException } from '@src/libs/exceptions';

@QueryHandler(GetBookingQuery)
export class GetBookingQueryHandler extends QueryHandlerBase {
  constructor(private readonly bookingRepo: BookingRepository) {
    super();
  }

  async handle(
    query: GetBookingQuery,
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const { user, bookingID } = query;
      const booking = await this.bookingRepo.findOneByIdOrThrow(bookingID);

      const bookingProps = booking.getPropsCopy();
      const { customer, artisan } = bookingProps;

      if (user != null) {
        if (
          user.id.value != customer.id.value &&
          user.id.value != artisan.id.value
        ) {
          throw new UnauthorizedException();
        }
      }

      const result = new BookingEntity({
        id: bookingProps.id,
        props: {
          ...bookingProps,
        },
      });

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
