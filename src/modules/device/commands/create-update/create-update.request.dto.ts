import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateUpdateRequest {
  @Expose({ name: 'push_token' })
  readonly pushToken: string;

  @Expose({ name: 'device_id' })
  readonly deviceId: string;

  readonly platform: string;

  @IsNotEmpty()
  readonly type: string;
}
