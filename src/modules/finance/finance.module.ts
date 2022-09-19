import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/database/user.repository';
import { UserModule } from '../user/user.module';
import { CreateFinanceCommandHandler } from './commands/create-finance/create-finance.command-handler1';
import { UpdateFinanceCommandHandler } from './commands/update-finance/update-finance.command-handler';
import { UpdateFinanceHttpController } from './commands/update-finance/update-finance.http-controller';
import { FinanceOrmEntity } from './database/finance.orm-entity';
import { FinanceRepository } from './database/finance.repository';
import { DownloadFinanceListHttpController } from './queries/download-finance-list/download-finance-list.http-controller';
import { DownloadFinanceListQueryHandler } from './queries/download-finance-list/download-finance-list.query-handler';
import { FindFinanceListHttpController } from './queries/find-finance-list/find-finance-list.http.controller';
import { FindFinanceListQueryHandler } from './queries/find-finance-list/find-finance-list.query-handler';
import { GetFinanceHttpController } from './queries/get-finance/get-finance.http.controller';
import { GetFinanceQueryHandler } from './queries/get-finance/get-finance.query-handler';

const httpControllers = [
  UpdateFinanceHttpController,
  GetFinanceHttpController,
  FindFinanceListHttpController,
  DownloadFinanceListHttpController,
];

const repositories = [FinanceRepository];

const commandHandlers = [
  CreateFinanceCommandHandler,
  UpdateFinanceCommandHandler,
];

const queryHandlers = [
  GetFinanceQueryHandler,
  FindFinanceListQueryHandler,
  DownloadFinanceListQueryHandler,
];

const typeOrm = TypeOrmModule.forFeature([FinanceOrmEntity]);

@Module({
  imports: [typeOrm, UserModule, CqrsModule, HttpModule],
  controllers: [...httpControllers],
  providers: [...repositories, ...commandHandlers, ...queryHandlers],
  exports: [...repositories, ...commandHandlers, ...queryHandlers, typeOrm],
})
export class FinanceModule {}
