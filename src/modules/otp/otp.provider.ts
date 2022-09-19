import { Provider } from '@nestjs/common';
import { SendOtpEventHandlers } from './application/event-handlers/send-otp.event-handlers';

export const sendOtpEventOtpEvent: Provider = {
  provide: SendOtpEventHandlers,
  useFactory: () => {
    const eventHandler = new SendOtpEventHandlers();
    eventHandler.listen();

    return eventHandler;
  },
  inject: [],
};
