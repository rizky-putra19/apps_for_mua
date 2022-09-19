import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { GetBookingQuery } from '@src/modules/booking/queries/get-booking/get-booking.query';
import { FinanceRepository } from '../../database/finance.repository';
import {
  FinanceEntity,
  FinanceProps,
} from '../../domain/entities/finance-entity';
import { GetFinanceQuery } from './get-finance.query';

@QueryHandler(GetFinanceQuery)
export class GetFinanceQueryHandler extends QueryHandlerBase {
  constructor(
    private readonly financeRepository: FinanceRepository,
    private readonly bookingRepository: BookingRepository,
  ) {
    super();
  }

  async handle(query: GetFinanceQuery): Promise<Result<FinanceEntity, Error>> {
    try {
      const { id } = query;
      const finance = await this.financeRepository.findFinanceById(id);
      const financeProps = finance.getPropsCopy();
      const booking = await this.bookingRepository.findOneByCodeorThrow(
        financeProps.bookingCode,
      );

      const result = new FinanceEntity({
        id: new UUID(finance.id.value),
        props: {
          booking,
          user: financeProps.user,
          amount: financeProps.amount,
          targetBank: financeProps.targetBank,
          targetBankAccountName: financeProps.targetBankAccountName,
          targetBankAccountNumber: financeProps.targetBankAccountNumber,
          financeStatus: financeProps.financeStatus,
          financeType: financeProps.financeType,
        },
      });

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
