import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { FinanceRepository } from '../../database/finance.repository';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import { FinanceStatus } from '../../domain/enums/finance-status.enum';
import { FinanceType } from '../../domain/enums/finance-type.enum';
import { CreateFinanceCommand } from './create-finance.command';

@CommandHandler(CreateFinanceCommand)
export class CreateFinanceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly financeRepository: FinanceRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateFinanceCommand,
  ): Promise<Result<FinanceEntity, Error>> {
    try {
      const {
        user,
        bookingCode,
        amount,
        targetBank,
        targetBankAccountName,
        targetBankAccountNumber,
        financeType,
      } = command;

      const financeEntity = FinanceEntity.create({
        user,
        bookingCode,
        amount,
        targetBank,
        targetBankAccountName,
        targetBankAccountNumber,
        financeStatus: FinanceStatus.WAITING,
        financeType: FinanceType[financeType.toUpperCase()],
      });

      const result = await this.financeRepository.save(financeEntity);
    } catch (error) {
      return Result.err(error);
    }
  }
}
