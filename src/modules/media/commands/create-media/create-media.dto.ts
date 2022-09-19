import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateMediaRequest {
  @Expose({ name: 'mime_type' })
  @IsNotEmpty()
  readonly mimeType: string;
}
