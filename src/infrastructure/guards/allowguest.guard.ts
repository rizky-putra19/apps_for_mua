import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_GUEST_KEY } from '@src/libs/decorators/allow-guest.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class AllowGuestGuard extends AuthGuard('custom') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    return user;
  }
}
