import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { UserAddressRepository } from '../../database/user-address.repository';
import { UserAddressEntity } from '../../domain/entities/user-address.entity';
import { GetAddressesQuery } from './get-addresses.query';

@QueryHandler(GetAddressesQuery)
export class GetAddressesQueryHandler extends QueryHandlerBase {
  constructor(private readonly addressRepository: UserAddressRepository) {
    super();
  }
  async handle(
    query: GetAddressesQuery,
  ): Promise<Result<DataAndCountMeta<UserAddressEntity[]>, Error>> {
    try {
      const { user } = query;
      const addressEntities = await this.addressRepository.findByUserId(
        user.id.value,
      );

      return Result.ok(addressEntities);
    } catch (error) {
      return Result.err(error);
    }
  }
}
