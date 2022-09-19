import { Result } from '@badrap/result';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { BasicAuth } from '@src/libs/decorators/allow-guest.decorator';
import { JwtTokenFactory } from '@src/libs/utils/jwt-token-factory.util';
import { TokenEntity } from '../../domain/entities/token.entity';
import { LoginQuery } from './login.query';
import { LoginRequest } from './login.request.dto';

@Controller('accounts/login')
export class LoginController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly tokenFactory: JwtTokenFactory,
  ) {}
  @Post()
  @HttpCode(200)
  @BasicAuth()
  @UseGuards(AuthGuard('basic'))
  async login(@Body() body: LoginRequest) {
    const result: Result<TokenEntity, Error> = await this.queryBus.execute(
      new LoginQuery({ request: body }),
    );
    return result.unwrap((t) => t);
  }
}
