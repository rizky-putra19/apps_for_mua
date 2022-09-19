import { Result } from '@badrap/result';
import { Storage } from '@google-cloud/storage';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { Command } from '@src/libs/ddd/domain/base-classes/command-base';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { MediaEntity, MediaProps } from '../../domain/entities/media.entity';
import { ConfirmUploadCommand } from './confirm-upload.command';

@CommandHandler(ConfirmUploadCommand)
export class ConfirmUploadCommandHandler extends CommandHandlerBase {
  private bucketName: string;
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super(unitOfWork);
    this.bucketName = this.configService.get('mediaBucketName');
  }

  async handle(
    command: ConfirmUploadCommand,
  ): Promise<Result<MediaEntity, Error>> {
    const mediaRepo = this.unitOfWork.getMediaRepository(command.correlationId);
    const media = await mediaRepo.findOneOrThrow({
      filename: command.filename,
    });
    const { filename, type, mediaType, uploaded } = media.getPropsCopy();

    if (uploaded) {
      throw new BadRequestException('Media is already confirmed');
    }

    const path = `${type}/${filename}`;

    const updateData: MediaProps = {
      filename: filename,
      type: type,
      typeId: command.typeId,
      mediaType: mediaType,
      uploaded: true,
      url: await this.getImageUrl(path),
    };

    const mediaEntity = await mediaRepo.save(
      new MediaEntity({ id: media.id, props: updateData }),
    );

    return Result.ok(mediaEntity);
  }

  private async getImageUrl(path: string): Promise<string> {
    try {
      const result = await firstValueFrom(
        this.httpService
          .get(`/image-url`, {
            params: { bucket: this.bucketName, image: path },
          })
          .pipe(
            catchError((err) => {
              return throwError(err);
            }),
          )
          .pipe(map((res) => res.data.image_url)),
      );
      return result;
    } catch (err) {
      return this.getPublicUrl(path);
    }
  }

  private getPublicUrl(path: string) {
    //TODO GET GOOGLE IMAGE DYNAMIC LINK AS DEFAULT

    return `https://storage.googleapis.com/${this.bucketName}/${path}`;
  }
}
