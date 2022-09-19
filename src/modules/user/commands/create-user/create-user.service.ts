import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { WalletEntity } from '@src/modules/wallet/domain/entities/wallet.entity';
import { firstValueFrom, map } from 'rxjs';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { UserMetadataEntity } from '../../domain/entities/user-metadata';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserAlreadyExistsError } from '../../errors/user.errors';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService extends CommandHandlerBase {
  private challengerBaseUrl: string;
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(unitOfWork);
    this.challengerBaseUrl = configService.get('challengerBaseUrl');
  }
  async handle(
    command: CreateUserCommand,
  ): Promise<Result<ID, UserAlreadyExistsError>> {
    const userRepo: UserRepositoryPort = this.unitOfWork.getUserRepository(
      command.correlationId,
    );
    const userExists = await userRepo.exists(
      command.email,
      command.type.toLocaleLowerCase(),
    );

    if (userExists) {
      /** Returning an Error instead of throwing it
       *  so a controller can handle it explicitly */
      return Result.err(
        new UserAlreadyExistsError('User with this email is already exists'),
      );
    }

    let metadata = [];
    switch (command.type) {
      case 'artisan':
        metadata.push(
          new UserMetadataEntity({
            name: 'categories',
            value: String(command.categories),
            dataType: 'number',
          }),
          new UserMetadataEntity({
            name: 'instagram',
            value: command.instagram,
            dataType: 'string',
          }),
          new UserMetadataEntity({
            name: 'birthdate',
            value: String(command.birthdate),
            dataType: 'date',
          }),
          new UserMetadataEntity({
            name: 'gender',
            value: command.gender,
            dataType: 'string',
          }),
        );
        break;
      case 'customer':
        metadata.push(
          new UserMetadataEntity({
            name: 'gender',
            value: command.gender,
            dataType: 'string',
          }),
        );
        break;
      default:
    }

    const wallet = WalletEntity.create({
      currentBalance: 0,
      onHold: 0,
      ready: 0,
    });

    const user =
      command.type == 'artisan'
        ? UserEntity.create({
            email: command.email,
            password: command.password,
            name: command.name,
            username: command.username,
            type: command.type,
            legacyId: command.legacyId,
            facebookId: command.facebookId,
            googleId: command.googleId,
            phoneNumber: command.phoneNumber,
            status:
              command.status != null
                ? command.status
                : UserStatus.UNVERIFIED_EMAIL,
            metadata,
            wallet,
          })
        : UserEntity.create({
            email: command.email,
            password: command.password,
            name: command.name,
            username: command.username,
            type: command.type,
            legacyId: command.legacyId,
            facebookId: command.facebookId,
            googleId: command.googleId,
            phoneNumber: command.phoneNumber,
            status:
              command.status != null
                ? command.status
                : UserStatus.UNVERIFIED_EMAIL,
            metadata,
          });

    const created = await userRepo.save(user);

    return Result.ok(created.id);
  }
}
