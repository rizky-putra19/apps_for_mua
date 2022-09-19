import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { BadRequestException, NotFoundException } from '@src/libs/exceptions';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import { FinanceRepository } from '../../database/finance.repository';
import {
  DownloadFinanceListDisburse,
  DownloadFinanceListRefund,
} from '../../dtos/finance.dto';
import { DownloadFinanceListQuery } from './download-finance-list.query';
import moment from 'moment';

@QueryHandler(DownloadFinanceListQuery)
export class DownloadFinanceListQueryHandler extends QueryHandlerBase {
  constructor(private readonly financeRepository: FinanceRepository) {
    super();
  }

  async handle(query: DownloadFinanceListQuery) {
    try {
      const { financeType } = query;
      const financeList = await this.financeRepository.findByFinanceType(
        financeType,
      );
      if (!financeList) {
        throw new NotFoundException('No data to download');
      }

      let data = [];

      if (financeType == 'disburse') {
        data = financeList.map((f) => {
          return new DownloadFinanceListDisburse(f);
        });
      }

      if (financeType == 'refund') {
        data = financeList.map((f) => {
          return new DownloadFinanceListRefund(f);
        });
      }

      let rows = [];

      data.forEach((doc) => {
        rows.push(Object.values(doc));
      });

      let book = new Workbook();

      let sheet = book.addWorksheet('sheet1');

      rows.unshift(Object.keys(data[0]));

      sheet.addRows(rows);
      this.styleSheet(sheet);

      const currDate = moment().format('YYYY-MM-DD');
      let file = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: `(${financeType}-${currDate})`,
            postfix: '.xlsx',
            mode: parseInt('0600', 8),
          },
          async (err, file) => {
            if (err) {
              throw new BadRequestException(err);
            }

            book.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          },
        );
      });

      return file;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private styleSheet(sheet) {
    sheet.getColumn(1).width = 20.5;
    sheet.getColumn(2).width = 20.5;
    sheet.getColumn(3).width = 20.5;
    sheet.getColumn(4).width = 20.5;
    sheet.getColumn(5).width = 20.5;
    sheet.getColumn(6).width = 20.5;
    sheet.getColumn(7).width = 20.5;
    sheet.getColumn(8).width = 20.5;

    sheet.getRow(1).height = 30.5;

    sheet.getRow(1).font = {
      size: 11.5,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'F33A6A' },
      fgColor: { argb: 'F33A6A' },
    };

    sheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    sheet.getRow(1).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
  }
}
