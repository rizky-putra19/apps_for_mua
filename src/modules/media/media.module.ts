import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmUploadCommandHandler } from './commands/confirm-upload/confirm-upload.command-handler';
import { ConfirmUploadHttpController } from './commands/confirm-upload/confirm-upload.http-controller';
import { CreateMediaCommandHandler } from './commands/create-media/create-media.command-handler';
import { CreateMediaHttpController } from './commands/create-media/create-media.http-controller';
import { MediaOrmEntity } from './database/media.orm-entity';
import { GetMediaQueryHandler } from './queries/get-media/get-media.query-handler';
import { MediaRepository } from './database/media.repository';
import { Storage } from '@google-cloud/storage';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { google } from '@google-cloud/pubsub/build/protos/protos';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { ConfirmUploadsHttpController } from './commands/confirm-uploads/confirm-uploads.http-controller';
import { ConfirmUploadsCommandHandler } from './commands/confirm-uploads/confirm-uploads.command-handler';

const googleStorage = {
  provide: Storage,
  useFactory: () => {
    let credentials = null;
    const saPath = path.resolve('./service_account.json');
    if (fs.existsSync(saPath)) {
      credentials = JSON.parse(fs.readFileSync(saPath).toString());
    }
    return new Storage({ credentials: credentials });
  },
  inject: [],
};
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([MediaOrmEntity]),
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('appspotUrl'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    CreateMediaHttpController,
    ConfirmUploadHttpController,
    ConfirmUploadsHttpController,
  ],
  providers: [
    CreateMediaCommandHandler,
    ConfirmUploadCommandHandler,
    ConfirmUploadsCommandHandler,
    GetMediaQueryHandler,
    MediaRepository,
    googleStorage,
  ],
  exports: [googleStorage, MediaRepository],
})
export class MediaModule {}
