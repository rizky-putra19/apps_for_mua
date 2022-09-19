import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ReportIssueEntity } from '../../domain/entities/report-issue.entity';
import { ReportIssueResponse } from '../../dtos/report-issue.dto';
import { CreateReportIssueCommand } from './create-report-issue.command';
import { CreateReportIssueRequest } from './create-report-issue.request';

@Controller({
  version: '1',
  path: '/report-issue',
})
export class CreateReportIssueHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard('custom'))
  async create(
    @User() user: UserEntity,
    @Body() request: CreateReportIssueRequest,
  ) {
    const result: Result<ReportIssueEntity> = await this.commandBus.execute(
      new CreateReportIssueCommand({
        user,
        issue: request,
      }),
    );

    return new DataResponseBase(
      result.unwrap((i) => new ReportIssueResponse(i)),
    );
  }
}
