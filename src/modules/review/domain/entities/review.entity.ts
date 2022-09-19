import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { BookingEntity } from '@src/modules/booking/domain/entities/booking.entity';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ReviewOrmEntity } from '../../database/review.orm-entity';

export interface CreateReviewProps {
  id?: number;
  rating: number;
  review: string;
  artisan: UserEntity;
  customer: UserEntity;
  booking: BookingEntity;
}

export interface ReviewProps extends CreateReviewProps {}

export class ReviewEntity implements ReviewProps {
  id?: number;
  rating: number;
  review: string;
  artisan: UserEntity;
  customer: UserEntity;
  booking: BookingEntity;

  constructor(props: ReviewEntity) {
    this.id = props.id;
    this.rating = props.rating;
    this.review = props.review;
    this.artisan = props.artisan;
    this.customer = props.customer;
    this.booking = props.booking;
  }

  static create(request: CreateReviewProps): ReviewEntity {
    const review = new ReviewEntity({
      rating: request.rating,
      review: request.review,
      artisan: request.artisan,
      customer: request.customer,
      booking: request.booking,
    });
    return review;
  }

  static convertToDomainEntity(reviewOrmEntity: ReviewOrmEntity): ReviewEntity {
    return new ReviewEntity({
      id: reviewOrmEntity.id,
      rating: reviewOrmEntity.rating,
      review: reviewOrmEntity.review,
      artisan: UserOrmMapper.convertToDomainEntity(reviewOrmEntity.artisan),
      customer: UserOrmMapper.convertToDomainEntity(reviewOrmEntity.customer),
      booking: BookingOrmMapper.toDomainEntity(reviewOrmEntity.booking),
    });
  }

  static convertToOrmEntity(entity: ReviewEntity): ReviewOrmEntity {
    const ormEntity = new ReviewOrmEntity();
    ormEntity.id = entity.id;
    ormEntity.rating = entity.rating;
    ormEntity.review = entity.review;
    ormEntity.artisan = UserOrmMapper.convertToOrmEntity(entity.artisan);
    ormEntity.customer = UserOrmMapper.convertToOrmEntity(entity.customer);
    ormEntity.booking = BookingOrmMapper.toOrmEntity(entity.booking);
    return ormEntity;
  }
}
