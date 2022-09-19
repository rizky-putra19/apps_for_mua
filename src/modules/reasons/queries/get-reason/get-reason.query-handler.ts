import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ReasonRepository } from '../../database/reason.repository';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { GetReasonQuery } from './get-reason.query';

@QueryHandler(GetReasonQuery)
export class GetReasonQueryHandler extends QueryHandlerBase {
  constructor(private readonly reasonRepo: ReasonRepository) {
    super();
  }

  async handle(query: GetReasonQuery): Promise<Result<ReasonEntity>> {
    try {
      const reason = await this.reasonRepo.findById(query.id);
      return Result.ok(reason);
    } catch (error) {
      return Result.err(error.message);
    }
  }
}
