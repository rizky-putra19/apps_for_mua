import { Expose } from 'class-transformer';

export class CheckScheduleRequest {
  @Expose({ name: 'artisan_id' })
  artisanId: string;
  month: number;
}
