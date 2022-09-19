import { Controller, Get, Request as Req, UseGuards } from '@nestjs/common';
import { User } from '@src/infrastructure/decorators';
import { CustomAuthGuard } from '@src/infrastructure/guards/custom.guard';
import { JwtAuthGuard } from '@src/infrastructure/guards/jwt.guard';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import { UserNotFoundError } from '../../errors/user.errors';

@Controller({
  version: '1',
  path: '/profile',
})
export class ProfileHttpController {
  @UseGuards(JwtAuthGuard)
  @Get()
  profile(@User() user: UserEntity) {
    return new DataResponseBase(new UserResponse(user));
  }
}
