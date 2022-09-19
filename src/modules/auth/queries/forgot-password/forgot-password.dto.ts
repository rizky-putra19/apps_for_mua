import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequest {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly type: string;
}
