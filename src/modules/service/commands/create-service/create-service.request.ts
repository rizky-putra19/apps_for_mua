import { Expose } from 'class-transformer';

export class CreateServiceRequest {
  title?: string;
  description: string;
  duration: number;
  price?: number;
  @Expose({ name: 'original_price' })
  originalPrice: number;
  category: number;
}
