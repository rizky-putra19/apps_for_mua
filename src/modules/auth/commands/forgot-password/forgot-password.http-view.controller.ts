import { Result } from '@badrap/result';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Email } from '@src/infrastructure/domain/value-objects/email.value-object';
import { CacheService } from '@src/libs/ddd/infrastructure/cache/cache.service';

import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { FindUserQuery } from '@src/modules/user/queries/find-user/find-user.query';
import { Request, Response } from 'express';
import { ForgotPasswordCommand } from './forgot-password.command';
import { ForgotPasswordRequest } from './forgot-password.dto';

@Controller('/auth')
export class ForgotPasswordHttpViewController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}
  @Get('/forgot-password')
  async forgotPassword(@Res() res: Response, @Query('code') code: string) {
    const token = await this.cacheService.get<string>(
      `forgot-token:${code}`,
      String,
    );
    if (!token) {
      return res.render('reset-password', {
        messageImage: 'admin-face.png',
        messageNote: 'Invalid URL',
        showButton: false,
        messageContent: `Invalid token/code`,
        actionText: 'OPEN APPLICATION',
      });
    }

    const [email, userType] = Buffer.from(token, 'base64')
      .toString('ascii')
      .split(':');
    const result: Result<UserEntity, Error> = await this.queryBus.execute(
      new FindUserQuery({ findType: 'email', userType, identifier: email }),
    );
    const user = result.unwrap().getPropsCopy();
    return res.render(`reset-password-${userType}`, {
      email,
      token: code,
      actionUrl: `${this.configService.get('appUrl')}/auth/forgot-password`,
    });
  }
  @Post('/forgot-password')
  async updatePassword(
    @Body() request: ForgotPasswordRequest,
    @Res() res: Response,
  ) {
    const result: Result<UserEntity> = await this.commandBus.execute(
      new ForgotPasswordCommand({
        code: request.token,
        email: new Email(request.email),
        newPassword: request.password,
      }),
    );
    const user = result.unwrap().getPropsCopy();
    return res.render(
      `reset-password-${user.type.toLocaleLowerCase()}-success`,
    );
  }
}
