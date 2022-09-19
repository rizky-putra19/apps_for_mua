import { IsNotEmpty } from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  readonly token: string;
  @IsNotEmpty()
  readonly password: string;
}
