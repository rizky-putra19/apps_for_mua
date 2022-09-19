import { EventEntity } from '../domain/entities/event.entity';

export class EventResponseDto {
  readonly title: string;
  readonly type: string;
  readonly description: string;
  readonly eventStartAt: Date;
  readonly eventEndAt: Date;
  readonly status: string;
  readonly address?: string;
  readonly latitude: number;
  readonly longitude: number;
  constructor(eventEntity: EventEntity) {
    const props = eventEntity.getPropsCopy();
    this.title = props.title;
    this.type = props.type;
    this.description = props.description;
    this.eventStartAt = props.eventStartAt;
    this.eventEndAt = props.eventEndAt;
    this.status = props.status;
    this.address = props.address;
    this.latitude = +props.latitude;
    this.longitude = +props.longitude;
  }
}
