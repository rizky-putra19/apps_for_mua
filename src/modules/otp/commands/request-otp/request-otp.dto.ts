import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RequestOtpRequest {
  @IsNotEmpty()
  @Expose({ name: 'type' })
  readonly type: string;
  @IsNotEmpty()
  @Expose({ name: 'descriptor' })
  readonly descriptor: string;
  @IsNotEmpty()
  @Expose({ name: 'user_type' })
  readonly userType: string;
}
