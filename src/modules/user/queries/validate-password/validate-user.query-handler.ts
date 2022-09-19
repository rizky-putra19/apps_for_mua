import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { UserRepository } from '../../database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { compareSync } from 'bcrypt';
import { ValidateUserQuery } from './validate-user.query';
import { InvalidPasswordError } from '../../errors/user.errors';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { UserType } from '../../domain/enums/user-type.enum';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { ConfigService } from '@nestjs/config';
import { hashSync } from 'bcrypt';

@QueryHandler(ValidateUserQuery)
export class ValidateUserQueryHandler extends QueryHandlerBase {
  private legacyBaseUrl: string;
  constructor(
    private readonly userRepo: UserRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.legacyBaseUrl = this.configService.get('legacyApiBaseUrl');
  }

  async handle(
    query: ValidateUserQuery,
  ): Promise<Result<UserEntity, InvalidPasswordError>> {
    try {
      const user = await this.userRepo.findOneByEmailAndTypeOrThrow(
        query.email.value,
        query.type,
      );

      const userProps = user.getPropsCopy();
      if (!compareSync(query.password, userProps.password)) {
        throw new InvalidPasswordError(
          'The email or password you entered is incorrect',
        );
      }

      return Result.ok(user);
    } catch (err) {
      if (err instanceof InvalidPasswordError) {
        throw err;
      }
      return this.findFromLegacy(query);
    }
  }

  private async findFromLegacy(
    query: ValidateUserQuery,
  ): Promise<Result<UserEntity, InvalidPasswordError>> {
    try {
      const u = await firstValueFrom(
        this.httpService
          .post(`${this.legacyBaseUrl}/${query.type}Login`, {
            email: query.email.value,
            password: query.password,
          })
          .pipe(
            map((res) => {
              return res.data.data.user;
            }),
          ),
      );

      const uEntity = await this.userRepo.save(
        UserEntity.create({
          email: u.email,
          password: query.password,
          type: UserType[query.type.toUpperCase()],
          legacyId: u.id,
          phoneNumber: u.phone,
          status: UserStatus.UNVERIFIED_EMAIL,
          metadata: [],
        }),
      );

      return Result.ok(uEntity);
    } catch (err) {
      console.log(err);
      return Result.err(new InvalidPasswordError('Invalid credentials'));
    }
  }
}
