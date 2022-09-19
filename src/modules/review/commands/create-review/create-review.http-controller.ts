import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { ReviewResponse } from '../../dtos/review.dto';
import { CreateReviewCommand } from './create-review.command';
import { CreateReviewRequest } from './create-review.request';

@Controller({
  version: '1',
  path: '/reviews',
})
export class CreateReviewHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard('custom'))
  async create(@User() user: UserEntity, @Body() request: CreateReviewRequest) {
    const result: Result<ReviewEntity> = await this.commandBus.execute(
      new CreateReviewCommand({
        user,
        reviews: request,
      }),
    );

    return new DataResponseBase(result.unwrap((r) => new ReviewResponse(r)));
  }
}
