import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddEditorChoiceRequest {
  @IsNotEmpty()
  @Expose({ name: 'artisan_id' })
  readonly artisanID: string;
}
