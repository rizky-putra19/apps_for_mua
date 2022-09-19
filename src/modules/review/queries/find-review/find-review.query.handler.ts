import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { ReviewRepository } from '../../database/review.repository';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { FindReviewQuery } from './find-review.query';

@QueryHandler(FindReviewQuery)
export class FindReviewQueryHandler extends QueryHandlerBase {
  constructor(private readonly reviewRepository: ReviewRepository) {
    super();
  }
  async handle(
    query: FindReviewQuery,
  ): Promise<Result<DataAndCountMeta<ReviewEntity[]>, Error>> {
    try {
      const { artisanID } = query;
      const reviews = await this.reviewRepository.FindListReview(artisanID);

      return Result.ok(reviews);
    } catch (error) {
      return Result.err(error);
    }
  }
}
