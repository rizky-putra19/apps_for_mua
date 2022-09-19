import {
  DomainPrimitive,
  ValueObject,
} from '@src/libs/ddd/domain/base-classes/value-object.base';
import { BadRequestException } from '@src/libs/exceptions';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
export interface PhoneProps {
  countryCode: string;
  phoneNumber: string;
}

export class Phone extends ValueObject<PhoneProps> {
  constructor(countryCode: string, phoneNumber: string) {
    super({ countryCode, phoneNumber });
    this.props.phoneNumber = Phone.format(phoneNumber, countryCode);
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  protected validate(props: PhoneProps): void {
    const util = PhoneNumberUtil.getInstance();
    const phoneNumber = util.parseAndKeepRawInput(
      props.phoneNumber,
      props.countryCode,
    );
    if (!util.isValidNumberForRegion(phoneNumber, props.countryCode)) {
      throw new BadRequestException('Invalid phone number');
    }
  }

  static format(phoneNumber: string, countryCode: string): string {
    const util = PhoneNumberUtil.getInstance();
    const formattedPhoneNumber = util.parseAndKeepRawInput(
      phoneNumber,
      countryCode,
    );

    return util.format(formattedPhoneNumber, PhoneNumberFormat.E164);
  }
}
