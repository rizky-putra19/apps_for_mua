import { ReasonEntity } from '../domain/entities/reason.entity';
import { ReasonType } from '../domain/enums/reason-type.enum';

export interface ReasonRepositoryPort {
  findById(id: number): Promise<ReasonEntity>;
  findMany(type: ReasonType): Promise<ReasonEntity[]>;
}
