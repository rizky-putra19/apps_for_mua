import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UserType } from '../enums/user-type.enum';

export class UserCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.type = props.type;
  }
  readonly email: string;
  readonly type: UserType;
  readonly id: ID;
  readonly name: string;
}
