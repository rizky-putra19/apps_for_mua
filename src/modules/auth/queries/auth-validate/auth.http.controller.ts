import { Result } from '@badrap/result';
import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthValidateQuery } from './auth-validate.query';

@Controller('/auth')
export class AuthHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async index(@Res() res: Response, @Headers() headers: IncomingHttpHeaders) {
    const result: Result<IncomingHttpHeaders> = await this.queryBus.execute(
      new AuthValidateQuery({ headers }),
    );
    const unwrapped = result.unwrap();
    res
      .set({ ...unwrapped })
      .status(HttpStatus.NO_CONTENT)
      .send();
  }
}
