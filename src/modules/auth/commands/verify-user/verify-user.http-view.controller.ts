import { Result } from '@badrap/result';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserNotFoundError } from '@src/modules/user/errors/user.errors';
import { Request, Response } from 'express';
import { VerifyUserCommand } from './verify-user.command';

@Controller('/auth')
export class VerifyUserHttpViewController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('/verify')
  async verify(@Res() res: Response, @Query('code') code: string) {
    const [secret, email, userType] = Buffer.from(code, 'base64')
      .toString()
      .split(':');
    const result: Result<UserEntity, UserNotFoundError> =
      await this.commandBus.execute(
        new VerifyUserCommand({ token: secret, descriptor: email, userType }),
      );

    const user = result.unwrap().getPropsCopy();

    return res.render('verify', {
      messageImage: 'reception-dog.png',
      messageNote: 'Email Confirmed!',
      messageHeader: `Hi ${user.name},`,
      messageSubheader: `${user.email}`,
      messageContent: `Your email account has been confirmed.
        You may continue login on our Beauty Bell App to continue.`,
      actionText: 'OPEN APPLICATION',
      actionUrl:
        userType == 'customer'
          ? 'https://link.beautybell.id/customer'
          : 'https://link.beautybell.id/artisan',
    });
  }
}
