import { Phone } from '@src/infrastructure/domain/value-objects/phone.value-object';
import {
  DomainEvent,
  DomainEventProps,
} from '@src/libs/ddd/domain/domain-events';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

export class OtpRequestedDomainEvent extends DomainEvent {
  readonly id: ID;
  readonly phoneNumber: string;
  readonly code: string;
  constructor(props: DomainEventProps<OtpRequestedDomainEvent>) {
    super(props);
    this.id = props.id;
    this.phoneNumber = props.phoneNumber;
    this.code = props.code;
  }
}
