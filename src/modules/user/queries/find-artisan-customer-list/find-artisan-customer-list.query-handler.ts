import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataWithPaginationMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { UserRepository } from '../../database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { FindArtisanCustomerListQuery } from './find-artisan-customer-list.query';

@QueryHandler(FindArtisanCustomerListQuery)
export class FindArtisanCustomerListQueryHandler extends QueryHandlerBase {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }
  async handle(
    query: FindArtisanCustomerListQuery,
  ): Promise<Result<DataWithPaginationMeta<UserEntity[]>, Error>> {
    const { params, userType, user } = query;
    let { page = 0, limit = 20 } = params;

    const result = await this.userRepository.findManyWithSearch({
      params: {
        user,
        userType,
        search: params.search,
        trending: params.trending,
        rating: params.rating,
        categories: params.categories,
        price: params.price,
        startPrice: params.startPrice,
        toPrice: params.toPrice,
        orderBy: params.orderBy,
        order: params.order,
      },
      pagination: {
        limit: parseInt(limit.toString(), 10),
        skip: page * limit,
        page: parseInt(page.toString(), 10),
      },
    });

    return Result.ok(result);
  }
}
