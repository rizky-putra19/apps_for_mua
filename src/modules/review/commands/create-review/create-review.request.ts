import { Expose } from 'class-transformer';

export class CreateReviewRequest {
  review: string;
  rating: number;
  @Expose({ name: 'artisan_id' })
  artisanId: string;
  @Expose({ name: 'booking_id' })
  bookingId: string;
}
