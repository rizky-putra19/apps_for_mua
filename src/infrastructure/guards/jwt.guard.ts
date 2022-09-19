import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ALLOW_GUEST_KEY,
  BASIC_AUTH,
} from '@src/libs/decorators/allow-guest.decorator';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const basicAuth = this.reflector.getAllAndOverride<boolean>(BASIC_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (basicAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
