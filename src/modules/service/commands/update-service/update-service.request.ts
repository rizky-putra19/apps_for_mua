import { Expose } from 'class-transformer';
import { ServiceStatus } from '../../domain/enum/service-status.enum';

export class UpdateServiceRequest {
  title: string;
  description: string;
  duration: number;
  price: number;
  @Expose({ name: 'original_price' })
  originalPrice: number;
  status: ServiceStatus;
}
