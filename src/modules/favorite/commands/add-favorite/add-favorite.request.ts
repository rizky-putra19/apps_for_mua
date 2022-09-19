import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddFavoriteRequest {
  @IsNotEmpty()
  @Expose({ name: 'artisan_id' })
  readonly artisanID: string;
}
