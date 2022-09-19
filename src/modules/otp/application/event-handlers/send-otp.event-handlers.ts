import {
  DomainEvent,
  DomainEventHandler,
} from '@src/libs/ddd/domain/domain-events';
import { OtpRequestedDomainEvent } from '../../domain/events/otp-requested.domain-event';

export class SendOtpEventHandlers extends DomainEventHandler {
  constructor() {
    super(OtpRequestedDomainEvent);
  }
  async handle(event: OtpRequestedDomainEvent): Promise<void> {
    console.log(
      `Sending to ${event.phoneNumber}`,
      `Kote verifikasi Beautybell Anda : ${event.code}. JANGAN BERIKAN kode ini kepada siapa pun. Kode ini berlaku selama 5 menit`,
    );
  }
}
