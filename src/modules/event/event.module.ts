import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateEventCommandHandler } from './commands/create-event/create-event.command-handler';
import { CreateEventHttpController } from './commands/create-event/create-event.http-controller';
import { DeleteEventCommandHandler } from './commands/delete-event/delete-event.command-handler';
import { DeleteEventHttpController } from './commands/delete-event/delete-event.http-controller';
import { UpdateEventCommandHandler } from './commands/update-event/update-event.command-handler';
import { UpdateEventHttpController } from './commands/update-event/update-event.http-controller';
import { EventOrmEntity } from './database/event.orm-entity';
import { EventRepository } from './database/event.repository';
import { FindEventHttpController } from './queries/find-event/find-event.http-controller';
import { FindEventQueryHandler } from './queries/find-event/find-event.query-handler';
import { GetEventHttpController } from './queries/get-event/get-event.http-controller';
import { GetEventQueryHandler } from './queries/get-event/get-event.query-handler';

@Module({
  imports: [TypeOrmModule.forFeature([EventOrmEntity]), CqrsModule],
  controllers: [
    CreateEventHttpController,
    UpdateEventHttpController,
    GetEventHttpController,
    DeleteEventHttpController,
    FindEventHttpController,
  ],
  providers: [
    EventRepository,
    CreateEventCommandHandler,
    UpdateEventCommandHandler,
    GetEventQueryHandler,
    DeleteEventCommandHandler,
    FindEventQueryHandler,
  ],
})
export class EventModule {}
