import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ReasonRepository } from '../../database/reason.repository';
import { ReasonEntity } from '../../domain/entities/reason.entity';
import { GetReasonsQuery } from './get-reasons.query';
import { Result } from '@badrap/result';

@QueryHandler(GetReasonsQuery)
export class GetReasonsQueryHandler extends QueryHandlerBase {
  constructor(private readonly reasonRepository: ReasonRepository) {
    super();
  }

  async handle(query: GetReasonsQuery): Promise<Result<ReasonEntity[]>> {
    try {
      const reasons = await this.reasonRepository.findMany(query.type);
      return Result.ok(reasons);
    } catch (error) {
      return Result.err(error.message);
    }
  }
}
