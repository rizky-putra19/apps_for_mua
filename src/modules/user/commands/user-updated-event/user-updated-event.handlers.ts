import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserEntity } from '../../domain/entities/user.entity';
import { JwtFactoryUtil } from '@src/libs/utils/jwt-factory.util';
import { catchError, firstValueFrom, throwError, map } from 'rxjs';
import { UserRepository } from '../../database/user.repository';
import { UserType } from '../../domain/enums/user-type.enum';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../errors/user.errors';
import { UpdateUserCommand } from '../update-user/update-user.command';
import { UserUpdatedEvent } from './user-updated.event.dto';
import { CreateUserCommand } from '../create-user/create-user.command';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserStatus } from '../../domain/enums/user-status.enum';

@Controller()
export class UserUpdatedEventHandler {
  private stage: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly httpService: HttpService,
    private readonly jwtFactory: JwtFactoryUtil,
    private readonly userRepo: UserRepository,
  ) {
    this.stage = process.env.STAGE;
  }

  @EventPattern('ARTISAN_UPDATED_EVENT_STG')
  async artisanUpdated(@Payload() event: UserUpdatedEvent) {
    if (this.stage == 'stg') {
      console.log('handle artisan updated...');
      await this.handleUpdateUser('artisan', event);
    }
  }

  @EventPattern('USER_UPDATED_EVENT_STG')
  async userUpdated(@Payload() event: UserUpdatedEvent) {
    if (this.stage == 'stg') {
      console.log('handle user updated...');
      await this.handleUpdateUser('customer', event);
    }
  }

  private async handleUpdateUser(type: string, event: UserUpdatedEvent) {
    const user = await this.userRepo.findOneByEmailAndType(
      event.payload.email,
      type,
    );
    const token = this.jwtFactory.generateJwt({ scope: 'internal' });

    const httpResult = await firstValueFrom(
      this.httpService
        .get(`${type}InternalProfile`, {
          params: {
            id: event.payload.id,
          },
          headers: {
            Authorization: token,
            Scope: 'internal',
          },
        })
        .pipe(
          catchError((err) => {
            return throwError(err);
          }),
        )
        .pipe(map((res) => res.data.data.user)),
    );

    if (!user) {
      const command: CreateUserCommand = new CreateUserCommand({
        email: httpResult.email,
        password: httpResult.password,
        name: httpResult.name,
        type: UserType[type.toUpperCase()],
        gender: 'male',
        phoneNumber: httpResult.phoneNumber,
        status: UserStatus.UNVERIFIED_EMAIL,
      });

      const result: Result<ID, UserAlreadyExistsError> =
        await this.commandBus.execute(command);

      return result.unwrap(
        (id) => new IdResponse(id.value),
        (err) => console.log(err),
      );
    }

    const command: UpdateUserCommand = new UpdateUserCommand({
      id: user.id,
      email: httpResult.email,
      password: httpResult.password,
      name: httpResult.name,
      type: UserType[type.toUpperCase()],
      phoneNumber: httpResult.phone,
      status: UserStatus.UNVERIFIED_EMAIL,
    });

    const result: Result<UserEntity, UserNotFoundError> =
      await this.commandBus.execute(command);

    return result.unwrap((err) => console.log(err));
  }
}
