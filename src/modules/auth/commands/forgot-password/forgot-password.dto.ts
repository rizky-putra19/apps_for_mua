import { IsEmail, isNotEmpty, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequest {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly token: string;
  @IsNotEmpty()
  readonly password: string;
}
