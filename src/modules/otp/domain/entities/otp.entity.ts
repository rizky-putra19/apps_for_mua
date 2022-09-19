import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { OtpType } from '../enums/otp-type.enum';
import { OtpRequestedDomainEvent } from '../events/otp-requested.domain-event';

export interface OtpProps {
  code: string;
  attempts: number;
  expiresAt: Date;
  identifier: string;
  lastAttemptAt?: Date;
  secret: string;
  validationAttempts: number;
  userType: UserType;
  type: OtpType;
}

export class OtpEntity extends AggregateRoot<OtpProps> {
  protected readonly _id: UUID;

  static create(request: OtpProps): OtpEntity {
    const id = UUID.generate();
    const otpProps: OtpProps = {
      code: request.code,
      attempts: 0,
      expiresAt: request.expiresAt,
      identifier: request.identifier,
      secret: request.secret,
      validationAttempts: request.validationAttempts,
      userType: request.userType,
      type: request.type,
    };

    const otpEntity = new OtpEntity({ id, props: otpProps });
    otpEntity.addEvent(
      new OtpRequestedDomainEvent({
        id,
        aggregateId: id.value,
        code: request.code,
        phoneNumber: request.identifier,
      }),
    );
    return otpEntity;
  }

  static update(id: ID, request: OtpProps): OtpEntity {
    const otpProps: OtpProps = {
      code: request.code,
      attempts: request.attempts,
      expiresAt: request.expiresAt,
      identifier: request.identifier,
      lastAttemptAt: request.lastAttemptAt,
      secret: request.secret,
      validationAttempts: request.validationAttempts,
      userType: request.userType,
      type: request.type,
    };

    const otpEntity = new OtpEntity({ id, props: otpProps });
    otpEntity.addEvent(
      new OtpRequestedDomainEvent({
        id,
        aggregateId: id.value,
        code: request.code,
        phoneNumber: request.identifier,
      }),
    );
    return otpEntity;
  }
}
