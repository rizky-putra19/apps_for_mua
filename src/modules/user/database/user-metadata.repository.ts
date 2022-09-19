import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMetadataEntity } from '../domain/entities/user-metadata';
import { UserMetadataOrmEntity } from './user-metadata.orm-entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserMetadataRepository {
  constructor(
    @InjectRepository(UserMetadataOrmEntity)
    private readonly userMetaRepository: Repository<UserMetadataOrmEntity>,
    private readonly userRepository: UserRepository,
  ) {}
  protected relations: string[];

  async save(userMetadataEntity: UserMetadataEntity) {
    return this.userMetaRepository.save(userMetadataEntity);
  }

  async findOneByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<UserMetadataEntity> {
    const metadata = await this.userMetaRepository.findOne({
      where: {
        name,
        user: {
          id: userId,
        },
      },
    });
    const metadataEntity = new UserMetadataEntity({
      id: metadata.id,
      name: metadata.name,
      value: metadata.value,
      dataType: metadata.dataType,
    });
    return metadataEntity;
  }
}
