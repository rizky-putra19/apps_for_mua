import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ConfirmUploadHttpRequest {
  @IsNotEmpty()
  filename: string;
  @Expose({ name: 'type_id' })
  typeId: string;
}
