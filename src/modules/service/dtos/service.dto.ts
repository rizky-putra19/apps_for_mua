import { ResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/response.base';
import { ServiceEntity } from '../domain/entities/service.entity';
import { ServiceStatus } from '../domain/enum/service-status.enum';
import { CategoryTreeResponse } from '@src/modules/category/dtos/category.dto';

export class ServiceResponse extends ResponseBase {
  title?: string;
  description: string;
  status: ServiceStatus;
  duration: number;
  price: number;
  originalPrice: number;
  category?: CategoryTreeResponse;
  images?: string[];
  artisan: string;

  constructor(entity: ServiceEntity) {
    super(entity);
    const props = entity.getPropsCopy();
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.duration = props.duration;
    this.price = props.price;
    this.originalPrice = props.originalPrice;
    this.category = new CategoryTreeResponse(props.category);
    this.images = props.images?.map((i) => i.getPropsCopy().url);
    this.artisan = props.artisan.id.value;
  }
}
