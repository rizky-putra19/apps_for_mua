import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { ReasonEntity } from '../domain/entities/reason.entity';
import { ReasonType } from '../domain/enums/reason-type.enum';
import { ReasonOrmEntiy } from './reason.orm-entity';
import { ReasonRepositoryPort } from './reason.repository.port';

@Injectable()
export class ReasonRepository implements ReasonRepositoryPort {
  constructor(
    @InjectRepository(ReasonOrmEntiy)
    private readonly reasonRepository: Repository<ReasonOrmEntiy>,
  ) {}
  protected relations: string[];

  async findById(id: number): Promise<ReasonEntity> {
    const reason = await this.reasonRepository.findOne({
      where: { id },
    });

    return reason;
  }

  async findMany(type: ReasonType): Promise<ReasonEntity[]> {
    const reasons = await this.reasonRepository.find({
      where: { type },
    });
    return reasons;
  }

  async save(entity: ReasonEntity): Promise<ReasonEntity> {
    const ormEntity = ReasonEntity.convertToOrmEntity(entity);
    const result = await this.reasonRepository.save(ormEntity);

    return ReasonEntity.convertToDomainEntity(result);
  }
}
