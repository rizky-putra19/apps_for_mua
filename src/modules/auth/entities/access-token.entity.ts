import { JwtToken } from '@src/interface-adapters/interfaces/auth/jwt-token.interface';
import { JwtPayload } from 'jsonwebtoken';

export class AccessTokenEntity implements JwtToken {
  constructor(
    private readonly rawToken: string,
    private readonly payload: JwtPayload,
    private readonly expiresIn?: number,
  ) {}

  getToken(): string {
    return this.rawToken;
  }

  get jwtPayload(): JwtPayload {
    return this.payload;
  }

  get expires(): number {
    return this.expiresIn;
  }
}
