import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { ReviewRepository } from '../../database/review.repository';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { CreateReviewCommand } from './create-review.command';

@CommandHandler(CreateReviewCommand)
export class CreateReviewCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly reviewRepository: ReviewRepository,
    protected readonly userRepository: UserRepository,
    protected readonly bookingRepository: BookingRepository,
  ) {
    super(unitOfWork);
  }

  async handle(
    command: CreateReviewCommand,
  ): Promise<Result<ReviewEntity, Error>> {
    try {
      const { user, reviews } = command;
      const { review, rating, artisanId, bookingId } = reviews;
      const artisan = await this.userRepository.findById(artisanId);
      const booking = await this.bookingRepository.findOneByIdOrThrow(
        bookingId,
      );

      if (user.getPropsCopy().type != 'customer') {
        throw new BadRequestException();
      }

      const reviewEntity = ReviewEntity.create({
        review,
        rating,
        artisan,
        booking,
        customer: user,
      });

      const result = await this.reviewRepository.save(reviewEntity);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
