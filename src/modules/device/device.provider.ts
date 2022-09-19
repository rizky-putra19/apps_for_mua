import { Provider } from '@nestjs/common';
import { OneSignalClient } from '@src/infrastructure/http/onesignal.client';
import { RegisterToOneSignalListeners } from './application/event-listeners/register-to-one-signal.listeners';
import { UpdateOneSignalListeners } from './application/event-listeners/update-one-signal.listeners';

export const registerToOneSignalEventHandler: Provider = {
  provide: RegisterToOneSignalListeners,
  useFactory: (oneSignalClient: OneSignalClient) => {
    const l = new RegisterToOneSignalListeners(oneSignalClient);
    l.listen();
    return l;
  },
  inject: [OneSignalClient],
};

export const updateOneSignalEventHandler: Provider = {
  provide: UpdateOneSignalListeners,
  useFactory: (oneSignalClient: OneSignalClient) => {
    const l = new UpdateOneSignalListeners(oneSignalClient);
    l.listen();
    return l;
  },
  inject: [OneSignalClient],
};
