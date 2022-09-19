import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { CreateMediaCommand } from './create-media.command';
import { extension } from 'mime-types';
import {
  CreateMediaProps,
  MediaEntity,
} from '../../domain/entities/media.entity';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateMediaCommand)
export class CreateMediaCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly configService: ConfigService,
    private readonly storage: Storage,
  ) {
    super(unitOfWork);
  }
  async handle(command: CreateMediaCommand): Promise<Result<any, Error>> {
    const mediaRepo = this.unitOfWork.getMediaRepository(command.correlationId);
    const mimeExtension = extension(command.mimeType);
    const filename = `${UUID.generate().value}.${mimeExtension}`;
    const props: CreateMediaProps = {
      filename: filename,
      mediaType: command.mediaType,
      type: command.type,
    };

    await mediaRepo.save(MediaEntity.create(props));
    const url = await this.generateV4SignedUrl(
      command.mimeType,
      `${command.type}/${filename}`,
    );

    return Result.ok({
      filename: props.filename,
      url,
    });
  }

  private async generateV4SignedUrl(mimeType: string, filePath: string) {
    const options: GetSignedUrlConfig = {
      version: 'v4', // defaults to 'v2' if missing.
      action: 'write',
      expires: Date.now() + 1000 * 60 * 60, // one hour
    };

    // const storage = new Storage({ credentials: credentials });
    const bucketName = this.configService.get('mediaBucketName');
    const [url] = await this.storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);
    return url;
  }
}
