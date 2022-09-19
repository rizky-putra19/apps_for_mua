import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingOrmEntity } from '../booking/database/booking.orm-entity';
import { FavoriteOrmEntity } from '../favorite/database/favorite.orm-entity';
import { MediaOrmEntity } from '../media/database/media.orm-entity';
import { MediaRepository } from '../media/database/media.repository';
import { ReviewOrmEntity } from '../review/database/review.orm-entity';
import { UserAddressOrmEntity } from '../user/database/user-addresses.orm-entity';
import { UserMetadataOrmEntity } from '../user/database/user-metadata.orm-entity';
import { UserOrmEntity } from '../user/database/user.orm-entity';
import { UserRepository } from '../user/database/user.repository';
import { AddEditorChoiceCommandHandler } from './commands/add-editor-choice/add-editor-choice.command-handler';
import { AddEditorChoiceHttpController } from './commands/add-editor-choice/add-editor-choice.http.controller';
import { RemoveEditorChoiceCommandHandler } from './commands/remove-editor-choice/remove-editor-choice.command';
import { RemoveEditorChoiceHttpController } from './commands/remove-editor-choice/remove-editor-choice.http.controller';
import { EditorChoiceOrmEntity } from './database/editor-choice.orm-entity';
import { EditorChoiceRepository } from './database/editor-choice.repository';
import { GetListEditorChoiceHttpController } from './queries/get-list-editor-choice/get-list-editor-choice.http.controller';
import { GetListEditorChoiceQueryHandler } from './queries/get-list-editor-choice/get-list-editor-choice.query-handler';

const httpControllers = [
  AddEditorChoiceHttpController,
  RemoveEditorChoiceHttpController,
  GetListEditorChoiceHttpController,
];

const commandHandlers = [
  AddEditorChoiceCommandHandler,
  RemoveEditorChoiceCommandHandler,
];

const queryHandlers = [GetListEditorChoiceQueryHandler];

const repositories = [EditorChoiceRepository, MediaRepository, UserRepository];

const typeOrm = TypeOrmModule.forFeature([
  MediaOrmEntity,
  EditorChoiceOrmEntity,
  UserOrmEntity,
  ReviewOrmEntity,
  BookingOrmEntity,
  FavoriteOrmEntity,
  UserAddressOrmEntity,
  UserMetadataOrmEntity,
]);

@Module({
  imports: [typeOrm, CqrsModule, HttpModule],
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...queryHandlers, ...repositories],
  exports: [...commandHandlers, ...queryHandlers, ...repositories, typeOrm],
})
export class EditorChoiceModule {}
