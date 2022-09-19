import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonHttpController } from './commands/create-reasons/create-reason.http.controller';
import { ReasonRepository } from './database/reason.repository';
import { CreateReasonCommandHandler } from './commands/create-reasons/create-reason.command-handler';
import { GetReasonHttpController } from './queries/get-reason/get-reason.http.controller';
import { GetReasonQueryHandler } from './queries/get-reason/get-reason.query-handler';
import { GetReasonsHttpController } from './queries/get-reasons/get-reasons.http.controller';
import { GetReasonsQueryHandler } from './queries/get-reasons/get-reasons.query-handler';
import { UpdateReasonHttpController } from './commands/update-reason-statuses/update-reason.http.controller';
import { UpdateReasonCommandHandler } from './commands/update-reason-statuses/update-reason.command-handler';
import { ReasonOrmEntiy } from './database/reason.orm-entity';
import { ReportIssueModule } from '../report-issue/report-issue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReasonOrmEntiy]),
    CqrsModule,
    HttpModule,
    ReportIssueModule,
  ],
  controllers: [
    ReasonHttpController,
    UpdateReasonHttpController,
    GetReasonHttpController,
    GetReasonsHttpController,
  ],
  providers: [
    ReasonRepository,
    CreateReasonCommandHandler,
    UpdateReasonCommandHandler,
    GetReasonQueryHandler,
    GetReasonsQueryHandler,
  ],
  exports: [
    TypeOrmModule.forFeature([ReasonOrmEntiy]),
    ReasonRepository,
    CreateReasonCommandHandler,
    UpdateReasonCommandHandler,
    GetReasonQueryHandler,
    GetReasonsQueryHandler,
    ReportIssueModule,
  ],
})
export class ReasonModule {}
