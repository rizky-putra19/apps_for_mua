import { Expose } from 'class-transformer';

export class AddMetadataRequest {
  name: string;
  value: string;
  @Expose({ name: 'data_type' })
  dataType: string;
}
