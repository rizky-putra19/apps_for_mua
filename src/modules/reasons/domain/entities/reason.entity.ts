import { ReasonOrmEntiy } from '../../database/reason.orm-entity';
import { ReasonType } from '../enums/reason-type.enum';

export interface CreatedReasonProps {
  reason: string;
  description: string;
  type: ReasonType;
}

export interface ReasonProps extends CreatedReasonProps {
  id?: number;
}

export class ReasonEntity implements ReasonProps {
  id?: number;
  reason: string;
  description: string;
  type: ReasonType;

  constructor(props: ReasonEntity) {
    this.id = props.id;
    this.reason = props.reason;
    this.description = props.description;
    this.type = props.type;
  }

  static create(request: CreatedReasonProps): ReasonEntity {
    const reason = new ReasonEntity({
      reason: request.reason,
      description: request.description,
      type: request.type,
    });
    return reason;
  }

  static update(request: ReasonProps): ReasonEntity {
    const reason = new ReasonEntity({
      id: request.id,
      reason: request.reason,
      description: request.description,
      type: request.type,
    });
    return reason;
  }

  static convertToOrmEntity(reasonEntity: ReasonEntity) {
    const reasonOrmEntity = new ReasonOrmEntiy();
    reasonOrmEntity.id = reasonEntity.id;
    reasonOrmEntity.reason = reasonEntity.reason;
    reasonOrmEntity.description = reasonEntity.description;
    reasonOrmEntity.type = reasonEntity.type;
    return reasonOrmEntity;
  }

  static convertToDomainEntity(ormEntity: ReasonOrmEntiy) {
    return new ReasonEntity({
      id: ormEntity.id,
      reason: ormEntity.reason,
      description: ormEntity.description,
      type: ormEntity.type,
    });
  }
}
