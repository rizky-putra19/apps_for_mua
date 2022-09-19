import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { CategoryRepository } from '@src/modules/category/database/category.repository';
import { FavoriteRepository } from '@src/modules/favorite/database/favorite.repository';
import { ReviewRepository } from '@src/modules/review/database/review.repository';
import { ServiceRepository } from '@src/modules/service/database/service.repository';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserNotFoundError } from '@src/modules/user/errors/user.errors';
import { ProfileQuery } from './profile.query';

@QueryHandler(ProfileQuery)
export class ProfileQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly favoriteRepo: FavoriteRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly reviewRepo: ReviewRepository,
    private readonly serviceRepo: ServiceRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {
    super();
  }
  async handle(
    query: ProfileQuery,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    const { user } = query;
    try {
      if (user.getPropsCopy().type == 'artisan') {
        const favorite = await this.favoriteRepo.countFavorite(user.id.value);
        const jobDone = await this.bookingRepo.countJobDone(user.id.value);
        let rating = 0;
        const reviews = await this.reviewRepo.FindListReview(user.id.value);
        if (reviews.data.length != 0) {
          rating =
            reviews.data.map((r) => r.rating).reduce((a, b) => a + b) /
            reviews.count;
        }
        const services = await this.serviceRepo
          .findManyPaginated({
            where: {
              artisan: {
                id: user.id.value,
              },
            },
          })
          .then((s) => s.data.map((c) => c.getPropsCopy().category));

        const category = await Promise.all(
          services.map(
            async (c) => await this.categoryRepo.findTopParent(c.id),
          ),
        );

        const result = new UserEntity({
          id: new UUID(user.id.value),
          props: {
            ...user.getPropsCopy(),
            favorite,
            jobDone,
            rating,
            category,
          },
        });

        return Result.ok(result);
      }
      return Result.ok(user);
    } catch (error) {
      return Result.err(error);
    }
  }
}
