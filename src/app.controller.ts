import { Controller, Get, OnApplicationShutdown, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  index(@Res() res: Response) {
    return res.json({
      app: 'BeautyBell V2',
    });
  }
}
