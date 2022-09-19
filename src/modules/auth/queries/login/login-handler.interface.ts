import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GrantType } from '../../domain/enums/grant-type.enum';
import { LoginRequest } from './login.request.dto';

export abstract class LoginHandler {
  abstract authenticate(request: LoginRequest): Promise<UserEntity>;

  protected getScopeByGrantType(grantType: GrantType) {
    switch (grantType) {
      case GrantType.APPLE:
      case GrantType.FACEBOOK:
      case GrantType.GOOGLE:
      case GrantType.PASSWORD:
        return 'customer';
      case GrantType.APPLE_ARTISAN:
      case GrantType.FACEBOOK_ARTISAN:
      case GrantType.APPLE_ARTISAN:
      case GrantType.PASSWORD_ARTISAN:
        return 'artisan';
      default:
        throw new BadRequestException('invalid grant type');
    }
  }
}
