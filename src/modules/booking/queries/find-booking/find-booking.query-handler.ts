import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { BookingRepository } from '../../database/booking.repository';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { FindBookingQuery } from './find-booking.query';
import moment from 'moment';

@QueryHandler(FindBookingQuery)
export class FindBookingQueryHandler extends QueryHandlerBase {
  constructor(private readonly bookingRepository: BookingRepository) {
    super();
  }
  async handle(
    query: FindBookingQuery,
  ): Promise<Result<DataWithPaginationMeta<BookingEntity[]>, Error>> {
    const { params, user } = query;
    let { page = 0, limit = 20 } = params;

    const bookings = await this.bookingRepository.findManyWithSearch({
      params: {
        search: params.search,
        statuses: params.statuses,
        categories: params.categories,
        services: params.services,
        createdDate: params.createdDate,
        eventDate: params.eventDate,
        startDate: moment(params.startDate).toDate(),
        toDate: moment(params.toDate).toDate(),
        orderBy: params.orderBy,
        order: params.order,
        users: user,
      },
      pagination: {
        limit: parseInt(limit.toString(), 10),
        skip: page * limit,
        page: parseInt(page.toString(), 10),
      },
    });

    return Result.ok(bookings);
  }
}
