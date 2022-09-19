import { ConfigService } from '@nestjs/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UUID } from '../ddd/domain/value-objects/uuid.value-object';
export class JwtFactoryUtil {
  private secret: string;
  constructor(private readonly configService: ConfigService) {
    this.secret = configService.get('legacyJwtSecret');
  }

  public generateJwt(payload: any) {
    return sign(payload, this.secret, {
      jwtid: UUID.generate().value,
    });
  }

  public generateLegacyToken(subject: string, scope: string, legacyId: string) {
    return sign(
      { identifier: legacyId, scope: scope },
      this.getSecretByScope(scope),
      {
        jwtid: UUID.generate().value,
        subject: subject,
        expiresIn: '30d',
        algorithm: 'HS256',
      },
    );
  }

  public verify(token: string, scope: string): JwtPayload | string {
    console.log(this.secret);
    return verify(token, this.getSecretByScope(scope));
  }

  private getSecretByScope(scope: string): string {
    return this.configService.get(`legacySecurity.${scope}TokenSecret`);
  }
}
