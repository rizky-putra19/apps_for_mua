import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { FinanceRepository } from '../../database/finance.repository';
import { FinanceEntity } from '../../domain/entities/finance-entity';
import { FinanceStatus } from '../../domain/enums/finance-status.enum';
import { UpdateFinanceCommand } from './update-finance.command';

@CommandHandler(UpdateFinanceCommand)
export class UpdateFinanceCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly financeRepository: FinanceRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateFinanceCommand,
  ): Promise<Result<FinanceEntity, Error>> {
    try {
      const {
        id,
        targetBank,
        targetBankAccountName,
        targetBankAccountNumber,
        financeStatus,
      } = command;

      const finance = await this.financeRepository.findOneByIdOrThrow(id);
      const financeProps = finance.getPropsCopy();

      const updated = await this.financeRepository.save(
        new FinanceEntity({
          id: new UUID(finance.id.value),
          props: {
            ...financeProps,
            targetBank:
              targetBank != null ? targetBank : financeProps.targetBank,
            targetBankAccountName:
              targetBankAccountName != null
                ? targetBankAccountName
                : financeProps.targetBankAccountName,
            targetBankAccountNumber:
              targetBankAccountNumber != null
                ? targetBankAccountNumber
                : financeProps.targetBankAccountNumber,
            financeStatus:
              financeStatus != null
                ? FinanceStatus[financeStatus.toUpperCase()]
                : financeProps.financeStatus,
          },
        }),
      );

      const result = await this.financeRepository.findFinanceById(id);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
