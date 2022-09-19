import { Result } from '@badrap/result';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { QueryHandler } from '@nestjs/cqrs';
import {
  Query,
  QueryHandlerBase,
} from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { JwtFactoryUtil } from '@src/libs/utils/jwt-factory.util';
import { use } from 'passport';
import { catchError, firstValueFrom, map, of, throwError } from 'rxjs';
import { UserRepository } from '../../database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserType } from '../../domain/enums/user-type.enum';
import { UserNotFoundError } from '../../errors/user.errors';
import { FindUserQuery } from './find-user.query';

@QueryHandler(FindUserQuery)
export class FindUserQueryHandler extends QueryHandlerBase {
  private legacyBaseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtFactory: JwtFactoryUtil,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super();
    this.legacyBaseUrl = this.configService.get('legacyApiBaseUrl');
  }
  async handle(
    query: FindUserQuery,
  ): Promise<Result<UserEntity, UserNotFoundError>> {
    try {
      const user = await this.handleFindByType(
        query.findType,
        query.userType,
        query.identifier,
      );

      if (user == undefined) {
        return Result.err(new UserNotFoundError());
      }

      return Result.ok(user);
    } catch (err) {
      if (err.isAxiosError && err.response.status == 404) {
        return Result.err(new UserNotFoundError());
      }
      return Result.err(err);
    }
  }

  async handleFindByType(
    type: string,
    userType: string,
    identifier: string,
  ): Promise<UserEntity | undefined> {
    let user: any;

    switch (type) {
      case 'email':
        user = await this.findByEmailInternal(identifier, userType);
        break;
      case 'id':
        user = await this.userRepository.findOneOrThrow({
          id: new UUID(identifier),
        });
        break;
      case 'legacyId':
        user = await this.findByEmailInternal(identifier, userType);
        break;
      case 'facebookId':
        user = await this.userRepository.findOneOrThrow({
          facebookId: identifier,
          type: UserType[userType.toUpperCase()],
        });
        break;
      case 'appleId':
        user = await this.userRepository.findOneOrThrow({
          facebookId: identifier,
          type: UserType[userType.toUpperCase()],
        });
        break;
      case 'googleId':
        user = await this.userRepository.findOneOrThrow({
          googleId: identifier,
          type: UserType[userType.toUpperCase()],
        });
        break;
      case 'phoneNumber':
        user = await this.userRepository.findOneOrThrow({
          phoneNumber: identifier,
          type: UserType[userType.toUpperCase()],
        });
        break;
      case 'username':
        user = await this.userRepository.findOneOrThrow({
          username: identifier,
          type: UserType[userType.toUpperCase()],
        });
        break;
    }

    if (user instanceof UserEntity) {
      return user;
    } else {
      return new UserEntity({
        id: UUID.generate(),
        props: {
          password: user.password,
          email: user.email,
          phoneNumber: user.phoneNumber,
          type: UserType[userType.toUpperCase()],
          legacyId: Number.isInteger(user.id) ? user.id : null,
          status: UserStatus.UNVERIFIED_EMAIL,
          metadata: [],
        },
      });
    }
  }

  async findByEmailInternal(identifier: string, userType: string) {
    const user = await this.userRepository.findOne({
      email: identifier,
      type: UserType[userType.toUpperCase()],
    });

    if (userType != UserType.ADMIN && user) {
      return user;
    }

    const token = this.jwtFactory.generateJwt({ scope: 'internal' });

    return firstValueFrom(
      this.httpService
        .post(
          `${this.legacyBaseUrl}/checkInternalEmail`,
          {
            email: identifier,
            type: userType,
          },
          {
            headers: {
              Authorization: token,
              Scope: 'internal',
            },
          },
        )
        .pipe(
          catchError((err) => {
            return throwError(err);
          }),
        )
        .pipe(
          map((res) => {
            return res.data.data.user;
          }),
        ),
    );
  }

  async findByIdInternal(identifier: string, userType: string) {
    const token = this.jwtFactory.generateJwt({ scope: 'internal' });
    return firstValueFrom(
      this.httpService
        .get(`${this.legacyBaseUrl}/${userType}InternalProfile`, {
          params: {
            id: identifier,
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
        .pipe(
          map((res) => {
            return res.data.data.user;
          }),
        ),
    );
  }
}
