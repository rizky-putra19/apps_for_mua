import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { BadRequestException } from '@src/libs/exceptions';
import { BookingRepository } from '../../database/booking.repository';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { BookingNotFound } from '../../errors/booking.errors';
import { GetProcessCodeQuery } from './get-process-code.query';

@QueryHandler(GetProcessCodeQuery)
export class GetProcessCodeQueryHandler extends QueryHandlerBase {
  constructor(private readonly bookingRepository: BookingRepository) {
    super();
  }
  async handle(
    query: GetProcessCodeQuery,
  ): Promise<Result<BookingEntity, BookingNotFound>> {
    try {
      const { user, bookingID } = query;
      const booking = await this.bookingRepository.findOneByIdOrThrow(
        bookingID,
      );
      const bookingProps = booking.getPropsCopy();
      const { customer } = bookingProps;
      if (customer.id.value != user.id.value) {
        throw new BadRequestException();
      }

      return Result.ok(booking);
    } catch (error) {
      return Result.err(error);
    }
  }
}
