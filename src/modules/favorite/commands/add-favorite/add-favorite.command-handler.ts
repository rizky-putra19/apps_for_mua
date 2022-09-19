import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { FavoriteRepository } from '../../database/favorite.repository';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { AddFavoriteCommand } from './add-favorite.command';

@CommandHandler(AddFavoriteCommand)
export class AddFavoriteCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly favoriteRepository: FavoriteRepository,
    protected readonly userRepository: UserRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: AddFavoriteCommand,
  ): Promise<Result<FavoriteEntity, Error>> {
    try {
      const { artisanID, user } = command;

      const found = await this.favoriteRepository.exist(
        user.id.value,
        artisanID,
      );
      if (found) {
        return Result.err(
          new BadRequestException('this favorite already exist'),
        );
      }

      const artisanEntity = await this.userRepository.findById(artisanID);
      const addFavoriteEntity = FavoriteEntity.create({
        artisan: artisanEntity,
        customer: user,
      });

      const added = await this.favoriteRepository.save(addFavoriteEntity);
      const result = FavoriteEntity.convertToDomainEntity(added);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
