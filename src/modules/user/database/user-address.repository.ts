import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from '../domain/entities/user-address.entity';
import { UserAddressOrmEntity } from './user-addresses.orm-entity';
import { UserAddressRepositoryPort } from './user-address.repository.port';
import { UserOrmMapper } from './user.orm-mapper';
import { UserRepository } from './user.repository';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';

@Injectable()
export class UserAddressRepository implements UserAddressRepositoryPort {
  constructor(
    @InjectRepository(UserAddressOrmEntity)
    private readonly userAddressRepository: Repository<UserAddressOrmEntity>,
    private readonly userRepository: UserRepository,
  ) {}
  protected relations: string[] = ['user'];

  async findByUserId(
    userID: string,
  ): Promise<DataAndCountMeta<UserAddressEntity[]>> {
    const [data, count] = await this.userAddressRepository.findAndCount({
      where: {
        user: userID,
      },
      relations: this.relations,
    });
    const result = {
      data: await Promise.all(
        data.map(async (a) => {
          const user = await this.userRepository.findById(a.user.id);
          a.user = UserOrmMapper.convertToOrmEntity(user);
          return UserAddressEntity.convertToDomainEntity(a);
        }),
      ),
      count,
    };

    return result;
  }

  async findOneById(id: number): Promise<UserAddressEntity> {
    const address = await this.userAddressRepository.findOne({
      where: {
        id,
      },
      relations: this.relations,
    });
    return UserAddressEntity.convertToDomainEntity(address);
  }

  async save(userAddressEntity: UserAddressEntity) {
    const ormEntity = new UserAddressOrmEntity();
    ormEntity.id = userAddressEntity.id;
    ormEntity.name = userAddressEntity.name;
    ormEntity.address = userAddressEntity.address;
    ormEntity.notes = userAddressEntity.notes;
    ormEntity.latitude = userAddressEntity.latitude;
    ormEntity.longitude = userAddressEntity.longitude;
    ormEntity.extra = userAddressEntity.extra;
    ormEntity.user = UserOrmMapper.convertToOrmEntity(userAddressEntity.user);
    return this.userAddressRepository.save(ormEntity);
  }
}
