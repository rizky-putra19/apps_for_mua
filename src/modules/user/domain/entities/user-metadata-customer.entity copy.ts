import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UserMetadataCustomer } from '../../dtos/user.metadata.customer.dto';

export interface CreateCustomerMetadataProps {
  gender: string;
}

export interface UserMetadataProps extends CreateCustomerMetadataProps {}

export class CustomerMetadataEntity {
  private gender: string;
  constructor(props: UserMetadataProps) {
    this.gender = props.gender;
  }

  static create(request: CreateCustomerMetadataProps): CustomerMetadataEntity {
    return new CustomerMetadataEntity({ gender: request.gender });
  }
}
