import { Result } from '@badrap/result';
import { CommandBus, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { GetOtpBySecretQuery } from '@src/modules/otp/queries/get-otp-by-secret/get-otp-by-secret.query';
import { CreateUserCommand } from '@src/modules/user/commands/create-user/create-user.command';
import { UserMetadataEntity } from '@src/modules/user/domain/entities/user-metadata';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserStatus } from '@src/modules/user/domain/enums/user-status.enum';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { UserAlreadyExistsError } from '@src/modules/user/errors/user.errors';
import { RegisterUserCommand } from './register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super(unitOfWork);
  }

  async handle(
    command: RegisterUserCommand,
  ): Promise<Result<UserEntity, UserAlreadyExistsError>> {
    const userRepo = this.unitOfWork.getUserRepository(command.correlationId);

    const decodeToken = await this.queryBus.execute(
      new GetOtpBySecretQuery({ secret: command.challengeToken }),
    );
    const phoneNumber = decodeToken.value.getPropsCopy().identifier;

    const userWithPhoneNumber = await userRepo.findOne({
      phoneNumber: phoneNumber,
      type: UserType[command.type.toUpperCase()],
    });

    const userWithEmail = await userRepo.findOne({
      email: command.email.value,
      type: UserType[command.type.toUpperCase()],
    });

    if (userWithPhoneNumber || userWithEmail) {
      throw new UserAlreadyExistsError();
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

    const createUserCommand = new CreateUserCommand({
      email: command.email.value,
      gender: command.gender,
      password: command.password,
      phoneNumber: phoneNumber,
      type: command.type,
      appleId: command.appleId,
      facebookId: command.facebookId,
      googleId: command.googleId,
      name: command.name,
      status: UserStatus.UNVERIFIED_EMAIL,
      categories: command.categories,
      username: command.username,
      instagram: command.instagram,
      birthdate: command.birthdate,
    });
    const result = this.commandBus.execute(createUserCommand);
    return result;
  }
}
