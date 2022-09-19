import { Provider } from '@nestjs/common';
import { IndexUserOnCreated } from './application/event-handlers/index-user-on-created';

export const indexUserEntityOnCreatedProvider: Provider = {
  provide: IndexUserOnCreated,
  useFactory: (): IndexUserOnCreated => {
    const eventHandler = new IndexUserOnCreated();
    eventHandler.listen();
    return eventHandler;
  },
};
