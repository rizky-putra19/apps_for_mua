import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidatePasswordRequest {
  @IsEmail()
  @IsNotEmpty()
  readonly identifier: string;
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly type: string;
}
