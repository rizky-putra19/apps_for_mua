import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { ReviewEntity } from '../domain/entities/review.entity';

export interface ReviewRepositoryPort {
  FindListReview(artisanID: string): Promise<DataAndCountMeta<ReviewEntity[]>>;
  save(entity: ReviewEntity): Promise<ReviewEntity>;
}
