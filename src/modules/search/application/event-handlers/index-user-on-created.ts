import { DomainEventHandler } from '@src/libs/ddd/domain/domain-events';
import { UserCreatedDomainEvent } from '@src/modules/user/domain/events/user-created.domain-event';

export class IndexUserOnCreated extends DomainEventHandler {
  constructor() {
    super(UserCreatedDomainEvent);
  }
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    // await walletRepo.save(wallet);
  }
}
