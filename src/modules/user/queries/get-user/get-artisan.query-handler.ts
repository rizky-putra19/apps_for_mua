import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BadRequestException, NotFoundException } from '@src/libs/exceptions';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { CategoryRepository } from '@src/modules/category/database/category.repository';
import { FavoriteRepository } from '@src/modules/favorite/database/favorite.repository';
import { ReviewRepository } from '@src/modules/review/database/review.repository';
import { ServiceRepository } from '@src/modules/service/database/service.repository';
import { UserRepository } from '../../database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../errors/user.errors';
import { GetArtisanQuery } from './get-user.query';

@QueryHandler(GetArtisanQuery)
export class GetArtisanQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly favoriteRepository: FavoriteRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {
    super();
  }
  async handle(
    query: GetArtisanQuery,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    const { userId, user } = query;
    const artisan = await this.userRepository.findById(userId);
    if (!artisan) {
      throw new NotFoundException('user not found');
    }

    const artisanProps = artisan.getPropsCopy();
    if (artisanProps.type != 'artisan') {
      throw new BadRequestException();
    }

    const isFavorite = await this.favoriteRepository.exist(
      user.id.value,
      artisanProps.id.value,
    );

    const favorite = await this.favoriteRepository.countFavorite(
      artisanProps.id.value,
    );

    const jobDone = await this.bookingRepository.countJobDone(
      artisanProps.id.value,
    );

    let rating = 0;
    const reviews = await this.reviewRepository.FindListReview(
      artisanProps.id.value,
    );
    if (reviews.data.length != 0) {
      rating =
        reviews.data.map((r) => r.rating).reduce((a, b) => a + b) /
        reviews.count;
    }

    const services = await this.serviceRepository
      .findManyPaginated({
        where: {
          artisan: {
            id: artisan.id.value,
          },
        },
      })
      .then((s) => s.data.map((c) => c.getPropsCopy().category));

    const category = await Promise.all(
      services.map(
        async (c) => await this.categoryRepository.findTopParent(c.id),
      ),
    );

    const result = new UserEntity({
      id: new UUID(artisanProps.id.value),
      props: {
        ...artisanProps,
        isFavorite,
        favorite,
        jobDone,
        rating,
        category,
      },
    });

    return Result.ok(result);
  }
}
