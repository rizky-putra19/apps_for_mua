import { Expose } from 'class-transformer';

export class CreateEventRequest {
  readonly title: string;
  readonly type: string;
  readonly description: string;
  @Expose({ name: 'event_start_at' })
  readonly eventStartAt: string;
  @Expose({ name: 'event_end_at' })
  readonly eventEndAt: string;
  readonly status?: string;
  readonly address?: string;
  readonly latitude?: number;
  readonly longitude?: number;
}
