import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request) {
    const subject = req.headers['x-subject'];
    if (subject != undefined) {
      const user = await this.authService.validateUser(subject.toString());
      return user.unwrap(
        (u) => u,
        (err) => new UnauthorizedException(),
      );
    }

    throw new UnauthorizedException();
  }
}
