import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BadRequestException } from '@src/libs/exceptions';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { MediaEntity, MediaProps } from '../../domain/entities/media.entity';
import { ConfirmUploadsCommand } from './confirm-uploads.command';

@CommandHandler(ConfirmUploadsCommand)
export class ConfirmUploadsCommandHandler extends CommandHandlerBase {
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
    command: ConfirmUploadsCommand,
  ): Promise<Result<MediaEntity[], Error>> {
    const mediaRepo = this.unitOfWork.getMediaRepository(command.correlationId);

    // media props
    const allMedia: MediaProps[] = await Promise.all(
      command.request.map(async (m) => {
        const mediaEntity = await mediaRepo.findOneOrThrow({
          filename: m.filename,
        });
        const mediaProps = mediaEntity.getPropsCopy();
        const path = `${mediaProps.type}/${mediaProps.filename}`;
        const updateData = {
          filename: mediaProps.filename,
          type: mediaProps.type,
          typeId: m.typeId,
          mediaType: mediaProps.mediaType,
          uploaded: mediaProps.uploaded,
          url: await this.getImageUrl(path),
        };
        return updateData;
      }),
    );

    // check if uploaded
    await Promise.all(
      allMedia.map(async (a) => {
        if (a.uploaded) {
          throw new BadRequestException('Media is already uploaded');
        }
      }),
    );

    const result = await Promise.all(
      allMedia.map(async (u) => {
        const mediaEntity = await mediaRepo.findOneOrThrow({
          filename: u.filename,
        });
        return await mediaRepo.save(
          new MediaEntity({
            id: new UUID(mediaEntity.id.value),
            props: {
              filename: u.filename,
              type: u.type,
              typeId: u.typeId,
              mediaType: u.mediaType,
              uploaded: true,
              url: u.url,
            },
          }),
        );
      }),
    );

    return Result.ok(result);
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
