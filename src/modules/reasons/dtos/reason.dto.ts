import { ReasonEntity } from '../domain/entities/reason.entity';
import { ReasonOrmEntiy } from '../database/reason.orm-entity';
import { ReasonType } from '../domain/enums/reason-type.enum';

export class ReasonResponse {
  id: number;
  reason: string;
  type: ReasonType;
  //   readonly createdAt: Date;
  //   readonly updatedAt: Date;

  constructor(entity: ReasonEntity) {
    this.id = entity.id;
    this.reason = entity.reason;
    this.type = entity.type;
    // this.createdAt = entity.createdAt;
    // this.updatedAt = entity.updatedAt;
  }
}
