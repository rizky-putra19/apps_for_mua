import { UserMetadataEntity } from '../domain/entities/user-metadata';

export interface UserMetadataRepositoryPort {
  findOneByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<UserMetadataEntity>;
}
