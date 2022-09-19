import { Expose } from 'class-transformer';
import { OtpEntity } from '../domain/entities/otp.entity';

export class OtpResponse {
  @Expose({ name: 'country_code' })
  readonly countryCode: string;
  readonly descriptor: string;
  readonly number: string;
  readonly token?: string;
  @Expose({ name: 'user_type' })
  readonly userType: string;
  constructor(entity: OtpEntity) {
    const props = entity.getPropsCopy();
    this.countryCode = 'id';
    this.descriptor = props.identifier;
    this.number = props.identifier.replace('+62', '');
    this.userType = props.userType;
  }
}
