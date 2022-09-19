import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { Controller, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { JwtFactoryUtil } from '@src/libs/utils/jwt-factory.util';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserType } from '../../domain/enums/user-type.enum';
import { UserAlreadyExistsError } from '../../errors/user.errors';
import { CreateUserCommand } from '../create-user/create-user.command';
import { CreateUser, UserCreatedEvent } from './user-created-event.dto';

@Controller()
export class UserCreatedEventHandler {
  private stage: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly httpService: HttpService,
    private readonly jwtFactory: JwtFactoryUtil,
    readonly configService: ConfigService,
  ) {
    this.stage = configService.get('stage');
  }

  @EventPattern('ARTISAN_CREATED_EVENT_STG')
  async artisanStgCreate(@Payload() event: UserCreatedEvent) {
    if (this.stage == 'stg') {
      console.log('handle artisan created...');
      await this.handleCreateUser('artisan', event);
    }
  }

  @EventPattern('USER_CREATED_EVENT_STG')
  async userStgCreate(@Payload() event: UserCreatedEvent) {
    if (this.stage == 'stg') {
      console.log('handle customer created...');
      await this.handleCreateUser('customer', event);
    }
  }

  private async handleCreateUser(type: string, event: UserCreatedEvent) {
    const token = this.jwtFactory.generateJwt({ scope: 'internal' });
    const httpResult = await firstValueFrom(
      this.httpService
        .get(`/${type}InternalProfile`, {
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

    const command: CreateUserCommand = new CreateUserCommand({
      email: httpResult.email,
      password: httpResult.password,
      name: httpResult.name,
      type: UserType[type.toUpperCase()],
      legacyId: httpResult.id,
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
}
