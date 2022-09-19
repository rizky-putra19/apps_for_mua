import { Query } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { MediaType } from '../../domain/enums/media-type.enum';

export class GetMediaQuery extends Query {
  readonly type: string;
  readonly typeId: string;
  readonly mediaType: MediaType;
  constructor(props: GetMediaQuery) {
    super();
    this.type = props.type;
    this.typeId = props.typeId;
    this.mediaType = props.mediaType;
  }
}
