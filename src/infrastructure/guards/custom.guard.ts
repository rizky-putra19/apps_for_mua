import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_GUEST_KEY } from '@src/libs/decorators/allow-guest.decorator';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('custom') {
  handleRequest(err, user, info) {
    return user;
  }
}
