import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { FavoriteRepository } from '../../database/favorite.repository';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { RemoveFavoriteCommand } from './remove-favorite.command';

@CommandHandler(RemoveFavoriteCommand)
export class RemoveFavoriteCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly favoriteRepository: FavoriteRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: RemoveFavoriteCommand,
  ): Promise<Result<FavoriteEntity, Error>> {
    try {
      const { id, user } = command;

      const favorite = await this.favoriteRepository.findOneByIdOrThrow(id);
      if (favorite.customer.id.value != user.id.value) {
        throw new BadRequestException();
      }
      await this.favoriteRepository.delete(favorite);
      return Result.ok(favorite);
    } catch (error) {
      return Result.err(error);
    }
  }
}
