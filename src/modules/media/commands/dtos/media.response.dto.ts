import { MediaEntity } from '../../domain/entities/media.entity';
import { MediaType } from '../../domain/enums/media-type.enum';

export class MediaResponse {
  readonly filename: string;
  readonly mediaType: MediaType;
  readonly type: string;
  readonly uploaded: boolean;
  readonly typeId?: string;
  readonly url?: string;
  constructor(media: MediaEntity) {
    const props = media.getPropsCopy();
    this.filename = props.filename;
    this.mediaType = props.mediaType;
    this.type = props.type;
    this.uploaded = props.uploaded;
    this.typeId = props.typeId;
    this.url = props.url;
  }
}
