import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { ReviewResponse } from '../../dtos/review.dto';
import { FindReviewQuery } from './find-review.query';
import { Result } from '@badrap/result';

@Controller({
  version: '1',
  path: '/reviews',
})
export class FindReviewHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get('/:artisanID')
  async show(@Param('artisanID') artisanID: string) {
    const result: Result<DataAndCountMeta<ReviewEntity[]>> =
      await this.queryBus.execute(
        new FindReviewQuery({
          artisanID,
        }),
      );

    return result.unwrap((r) => {
      const { data, count } = r;
      return new DataListResponseBase(
        data.map((d) => new ReviewResponse(d)),
        { count },
      );
    });
  }
}
