import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BadRequestException } from '@src/libs/exceptions';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { WalletRepository } from '../../database/wallet.repository';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { CreateWalletCommand } from './create-wallet.command';

@CommandHandler(CreateWalletCommand)
export class CreateWalletCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly walletRepository: WalletRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateWalletCommand,
  ): Promise<Result<WalletEntity, Error>> {
    try {
      const { user } = command;
      if (user.getPropsCopy().type != 'artisan') {
        throw new BadRequestException();
      }
      const wallet = WalletEntity.create({
        artisan: user,
        currentBalance: 0,
        onHold: 0,
        ready: 0,
      });

      const result = await this.walletRepository.save(wallet);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
