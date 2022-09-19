import { Expose } from 'class-transformer';

export class TokenEntity {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;
  @Expose({ name: 'refresh_token' })
  readonly refreshToken?: string;
  @Expose({ name: 'token_type' })
  readonly tokenType: string;
  @Expose({ name: 'expires_in' })
  readonly expiresIn: number;
  constructor(props?: TokenEntity) {
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.tokenType = props.tokenType;
    this.expiresIn = props.expiresIn;
  }
}
