import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { DownloadFinanceListQuery } from './download-finance-list.query';

@Controller({
  version: '1',
  path: '/finance',
})
export class DownloadFinanceListHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/download/:financeType')
  @Header('Content-Type', 'text/xlsx')
  async download(
    @Res() res: Response,
    @Param('financeType') financeType: string,
  ) {
    const result = await this.queryBus.execute(
      new DownloadFinanceListQuery({
        financeType,
      }),
    );

    res.download(`${result}`);
    return result;
  }
}
