import { Result } from '@badrap/result';
import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import { FinanceType } from '../../domain/enums/finance-type.enum';
import {
  FinanceListDisburseResponse,
  FinanceListRefundResponse,
} from '../../dtos/finance.dto';
import { UpdateFinanceCommand } from './update-finance.command';
import { UpdateFinanceRequest } from './update-finance.request';

@Controller({
  version: '1',
  path: '/finance',
})
export class UpdateFinanceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateFinanceRequest) {
    const command = new UpdateFinanceCommand({
      id,
      targetBank: body.targetBank,
      targetBankAccountName: body.targetBankAccountName,
      targetBankAccountNumber: body.targetBankAccountNumber,
      financeStatus: body.financeStatus,
    });

    const result: Result<FinanceEntity, Error> = await this.commandBus.execute(
      command,
    );

    return new DataResponseBase(
      result.unwrap((f) =>
        f.getPropsCopy().financeType == FinanceType.DISBURSE
          ? new FinanceListDisburseResponse(f)
          : new FinanceListRefundResponse(f),
      ),
    );
  }
}
