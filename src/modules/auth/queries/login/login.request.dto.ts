import { Expose } from 'class-transformer';

export class LoginRequest {
  identifier: string;
  password: string;
  @Expose({ name: 'grant_type' })
  grantType: string;
}
