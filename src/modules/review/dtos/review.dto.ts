import { BookingResponse } from '@src/modules/booking/dtos/booking.dto';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { ReviewEntity } from '../domain/entities/review.entity';

export class ReviewResponse {
  id: number;
  rating: number;
  review: string;
  artisan: UserResponse;
  booking: BookingResponse;
  constructor(entity: ReviewEntity) {
    this.id = entity.id;
    this.rating = entity.rating;
    this.review = entity.review;
    this.artisan = new UserResponse(entity.artisan);
    this.booking = new BookingResponse(entity.booking);
  }
}
