import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenEntity } from '@src/modules/auth/entities/access-token.entity';
import { JwtPayload } from 'jsonwebtoken';
import { UUID } from '../ddd/domain/value-objects/uuid.value-object';
import { BadRequestException } from '../exceptions';

@Injectable()
export class JwtTokenFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getExpiredClaims(token: string) {
    return this.jwtService.decode(token);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async createAccessToken(
    subject: string,
    grantType: string,
    previousGrantType?: string,
  ) {
    const expiresIn = this.configService.get('jwtTokenExpirationTime');
    const tokenId = UUID.generate().value;

    const token = this.jwtService.sign(
      {
        scope: this.getScopeByGrantType(grantType),
        grant_type: previousGrantType || grantType,
      },
      {
        subject: subject,
        jwtid: tokenId,
      },
    );

    return new AccessTokenEntity(token, { jti: tokenId }, expiresIn);
  }

  async createGuestToken() {
    const expiresIn = this.configService.get('jwtTokenExpirationTime');
    const token = this.jwtService.sign({ grant_type: 'guest' });
    return new AccessTokenEntity(token, {}, expiresIn);
  }

  async createRefreshToken(payload: JwtPayload) {
    const { jti } = payload;
    const token = this.jwtService.sign(
      {},
      {
        expiresIn: `${
          this.configService.get('jwtTokenExpirationTime') / 3600 / 24
        }d`,
        jwtid: jti,
      },
    );

    return new AccessTokenEntity(token, { jti });
  }

  getScopeByGrantType(grantType: string) {
    let scope = 'customer';
    switch (grantType) {
      case 'phone':
        scope = 'customer';
        break;
      case 'phone_beautypreneur':
        scope = 'beautypreneur';
        break;
    }
    return scope;
  }
}
