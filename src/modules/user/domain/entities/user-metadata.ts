import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UserMetadataCustomer } from '../../dtos/user.metadata.customer.dto';

export interface CreateCustomerMetadataProps {
  id?: number;
  name: string;
  value: string;
  dataType: string;
}

export interface UserMetadataProps extends CreateCustomerMetadataProps {}

export class UserMetadataEntity {
  readonly name: string;
  readonly value: string;
  readonly dataType: string;
  readonly id: number;
  constructor(props: UserMetadataProps) {
    this.name = props.name;
    this.value = props.value;
    this.dataType = props.dataType;
    this.id = props.id;
  }
}
