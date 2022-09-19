import { Expose } from 'class-transformer';

export class ValidateOtpRequest {
  readonly secret: string;
  readonly descriptor: string;
  readonly type: string;
  @Expose({ name: 'user_type' })
  readonly userType: string;
}
