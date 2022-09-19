import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { UserAddressEntity } from '../domain/entities/user-address.entity';

export interface UserAddressRepositoryPort {
  findByUserId(userID: string): Promise<DataAndCountMeta<UserAddressEntity[]>>;
  findOneById(id: number): Promise<UserAddressEntity>;
}
