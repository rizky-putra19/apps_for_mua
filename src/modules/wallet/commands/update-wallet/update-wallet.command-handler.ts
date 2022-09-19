import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { NotFoundException } from '@src/libs/exceptions';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { WalletRepository } from '../../database/wallet.repository';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { UpdateWalletCommand } from './update-wallet.command';

@CommandHandler(UpdateWalletCommand)
export class UpdateWalletCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly walletRepository: WalletRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: UpdateWalletCommand,
  ): Promise<Result<WalletEntity, Error>> {
    const { artisanID, currentBalance, onHold, ready, histories } = command;
    try {
      const wallet = await this.walletRepository.findOneByUserId(artisanID);

      const updatedEntity = new WalletEntity({
        id: wallet.id,
        currentBalance,
        onHold,
        ready,
        artisan: wallet.artisan,
        histories,
      });

      const updated = await this.walletRepository.save(updatedEntity);

      return Result.ok(updated);
    } catch (error) {
      return Result.err(error);
    }
  }
}
