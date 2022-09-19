import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataWithPaginationMeta,
  FindManyPaginatedParams,
  FindManyPaginatedSearch,
  QueryParams,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import { FavoriteOrmEntity } from '@src/modules/favorite/database/favorite.orm-entity';
import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import { MediaRepository } from '@src/modules/media/database/media.repository';
import { ReviewOrmEntity } from '@src/modules/review/database/review.orm-entity';
import { ReviewRepository } from '@src/modules/review/database/review.repository';
import { ServiceOrmEntity } from '@src/modules/service/database/service.orm-entity';
import { Brackets, Repository } from 'typeorm';
import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { UserType } from '../domain/enums/user-type.enum';
import { UserMetadataOrmEntity } from './user-metadata.orm-entity';
import { UserMetadataRepository } from './user-metadata.repository';
import { UserOrmEntity } from './user.orm-entity';
import { UserOrmMapper } from './user.orm-mapper';
import { UserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserRepository
  extends TypeormRepositoryBase<UserEntity, UserProps, UserOrmEntity>
  implements UserRepositoryPort
{
  protected relations: string[] = ['metadata', 'wallet'];
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
    private readonly mediaRepository: MediaRepository,
    @InjectRepository(UserMetadataOrmEntity)
    private readonly userMetadataRepository: Repository<UserMetadataOrmEntity>,
    @InjectRepository(ReviewOrmEntity)
    private readonly reviewRepository: Repository<ReviewOrmEntity>,
    @InjectRepository(BookingOrmEntity)
    private readonly bookingRepository: Repository<BookingOrmEntity>,
    @InjectRepository(FavoriteOrmEntity)
    private readonly favoriteRepository: Repository<FavoriteOrmEntity>,
  ) {
    super(
      userRepository,
      new UserOrmMapper(UserEntity, UserOrmEntity),
      new Logger('UserRepository'),
    );
  }

  async findManyPaginated({
    where,
    pagination,
    order,
  }: FindManyPaginatedParams<UserOrmEntity>): Promise<
    DataWithPaginationMeta<UserEntity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where,
      order,
      relations: this.relations,
    });
    const mappedData = await Promise.all(
      data.map((res) => this.mapAvatar(res)),
    );
    const result: DataWithPaginationMeta<UserEntity[]> = {
      data: mappedData.map((item) => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async findManyWithSearch({
    params,
    pagination,
  }: FindManyPaginatedSearch): Promise<DataWithPaginationMeta<UserEntity[]>> {
    const qb = this.createQueryBuilder('users')
      .leftJoinAndMapMany(
        'users.services',
        ServiceOrmEntity,
        'services',
        'users.id = services.artisan.id',
      )
      .leftJoinAndSelect('users.metadata', 'user_metadata')
      .leftJoinAndSelect('users.addresses', 'user_addresses')
      .leftJoinAndSelect('services.category', 'categories')
      .leftJoinAndSelect('categories.parent', 'parent')
      .leftJoinAndSelect('parent.parent', 'top_parent');

    if (
      params.user.getPropsCopy().type != 'artisan' &&
      params.user.getPropsCopy().type != 'customer'
    ) {
      if (params.userType) {
        if (params.userType == 'artisan') {
          qb.where(
            new Brackets((qb) => {
              qb.where(`users.type = 'artisan'`);
            }),
          );
        }

        if (params.userType == 'customer') {
          qb.where(
            new Brackets((qb) => {
              qb.where(`users.type = 'customer'`);
            }),
          );
        }
      }
    }

    if (params.user.getPropsCopy().type == 'customer') {
      qb.where(
        new Brackets((qb) => {
          qb.where(`users.type = 'artisan'`).andWhere(
            `users.status = 'active'`,
          );
        }),
      );
    }

    if (params.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            `MATCH(users.username)against(:search IN BOOLEAN MODE) AND users.type = 'artisan'`,
            {
              search: params.search,
            },
          )
            .orWhere('lower(users.name) like lower(:search)', {
              search: params.search,
            })
            .orWhere('lower(categories.name) like lower(:search)', {
              search: params.search,
            })
            .orWhere('lower(parent.name) like lower(:search)', {
              search: params.search,
            })
            .orWhere('lower(top_parent.name) like lower(:search)', {
              search: params.search,
            });
        }),
      );
    }

    if (params.categories) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('top_parent.id in (:categories)', {
            categories: params.categories,
          });
        }),
      );
    }

    if (params.price) {
      qb.where(
        new Brackets((qb) => {
          qb.where('services.price >= :startPrice', {
            startPrice: params.startPrice,
          }).andWhere('services.price <= :toPrice', {
            toPrice: params.toPrice,
          });
        }),
      );
    }

    if (params.orderBy) {
      if (params.orderBy == 'created_at') {
        qb.orderBy({ 'users.createdAt': params.order });
      }
      if (params.orderBy == 'name') {
        qb.orderBy({ 'users.name': params.order });
      }
      if (params.orderBy == 'username') {
        qb.orderBy({ 'users.username': params.order });
      }
      if (params.orderBy == 'email') {
        qb.orderBy({ 'users.email': params.order });
      }
      if (params.orderBy == 'phone_number') {
        qb.orderBy({ 'users.phoneNumber': params.order });
      }
      if (params.orderBy == 'categories') {
        qb.orderBy({ 'top_parent.name': params.order });
      }
    }

    // get artisan trending sort high rating to low rating
    if (params.trending) {
      const [data, count] = await qb.getManyAndCount();

      const entityData = await Promise.all(
        data.map(async (item) => {
          this.mapAvatar(item);
          return this.mapper.toDomainEntity(item);
        }),
      );

      let usersData = await Promise.all(
        entityData.map(async (item) => {
          const props = item.getPropsCopy();

          if (props.type == 'artisan') {
            // count rating
            let rating = 0;
            const [reviews, count] = await this.reviewRepository.findAndCount({
              where: {
                artisan: {
                  id: item.id.value,
                },
              },
            });
            if (reviews.length != 0) {
              rating =
                reviews.map((a) => a.rating).reduce((a, b) => a + b) / count;
            }

            // count job done
            const [bookingOrmEntity, jobDone] =
              await this.bookingRepository.findAndCount({
                where: {
                  status: {
                    status: 'completed',
                  },
                  artisan: {
                    id: item.id.value,
                  },
                },
                relations: ['status'],
              });

            // count favorite
            const [FavoriteOrmEntity, favorite] =
              await this.favoriteRepository.findAndCount({
                where: {
                  artisan: {
                    id: item.id.value,
                  },
                },
                relations: ['artisan'],
              });

            const newEntity = new UserEntity({
              id: new UUID(item.id.value),
              props: {
                ...props,
                rating,
                jobDone,
                favorite,
              },
            });

            return newEntity;
          }
        }),
      );

      usersData.sort((a, b) => {
        const ratingA = a.getPropsCopy().rating;
        const ratingB = b.getPropsCopy().rating;

        if (ratingA > ratingB) {
          return -1;
        }
        if (ratingA < ratingB) {
          return 1;
        }
        return 0;
      });

      const limitResult = usersData.slice(0, pagination?.limit);

      const result: DataWithPaginationMeta<UserEntity[]> = {
        data: limitResult,
        count: limitResult.length,
      };

      return result;
    }

    const [data, count] = await qb
      .skip(pagination?.skip)
      .take(pagination?.limit)
      .getManyAndCount();

    const entityData = await Promise.all(
      data.map(async (item) => {
        this.mapAvatar(item);
        return this.mapper.toDomainEntity(item);
      }),
    );

    let usersData = await Promise.all(
      entityData.map(async (item) => {
        const props = item.getPropsCopy();

        if (props.type == 'artisan') {
          // count rating
          let rating = 0;
          const [reviews, count] = await this.reviewRepository.findAndCount({
            where: {
              artisan: {
                id: item.id.value,
              },
            },
          });
          if (reviews.length != 0) {
            rating =
              reviews.map((a) => a.rating).reduce((a, b) => a + b) / count;
          }

          // count job done
          const [bookingOrmEntity, jobDone] =
            await this.bookingRepository.findAndCount({
              where: {
                status: {
                  status: 'completed',
                },
                artisan: {
                  id: item.id.value,
                },
              },
              relations: ['status'],
            });

          // count favorite
          const [FavoriteOrmEntity, favorite] =
            await this.favoriteRepository.findAndCount({
              where: {
                artisan: {
                  id: item.id.value,
                },
              },
              relations: ['artisan'],
            });

          const newEntity = new UserEntity({
            id: new UUID(item.id.value),
            props: {
              ...props,
              rating,
              jobDone,
              favorite,
            },
          });

          return newEntity;
        }
        return item;
      }),
    );

    // order by rating
    if (params.orderBy == 'rating') {
      if (params.order == 'ASC') {
        usersData.sort((a, b) => {
          const ratingA = a.getPropsCopy().rating;
          const ratingB = b.getPropsCopy().rating;

          if (ratingA < ratingB) {
            return -1;
          }
          if (ratingA > ratingB) {
            return 1;
          }
          return 0;
        });
      }

      if (params.order == 'DESC') {
        usersData.sort((a, b) => {
          const ratingA = a.getPropsCopy().rating;
          const ratingB = b.getPropsCopy().rating;

          if (ratingA > ratingB) {
            return -1;
          }
          if (ratingA < ratingB) {
            return 1;
          }
          return 0;
        });
      }
    }

    // order by gender
    if (params.orderBy == 'gender') {
      if (params.order == 'ASC') {
        usersData.sort((a, b) => {
          const genderA = a
            .getPropsCopy()
            .metadata.filter((a) => a.name == 'gender');
          const genderB = b
            .getPropsCopy()
            .metadata.filter((b) => b.name == 'gender');

          if (genderA[0].value < genderB[0].value) {
            return -1;
          }
          if (genderA[0].value > genderB[0].value) {
            return 1;
          }
          return 0;
        });
      }

      if (params.order == 'DESC') {
        usersData.sort((a, b) => {
          const genderA = a
            .getPropsCopy()
            .metadata.filter((a) => a.name == 'gender');
          const genderB = b
            .getPropsCopy()
            .metadata.filter((b) => b.name == 'gender');

          if (genderA[0].value > genderB[0].value) {
            return -1;
          }
          if (genderA[0].value < genderB[0].value) {
            return 1;
          }
          return 0;
        });
      }
    }

    if (params.rating) {
      if (params.rating == 1) {
        const result: DataWithPaginationMeta<UserEntity[]> = {
          data: usersData.filter((a) => a.getPropsCopy().rating >= 1),
          count,
          limit: pagination?.limit,
          page: pagination?.page,
        };
        return result;
      }
      if (params.rating == 2) {
        const result: DataWithPaginationMeta<UserEntity[]> = {
          data: usersData.filter((a) => a.getPropsCopy().rating >= 2),
          count,
          limit: pagination?.limit,
          page: pagination?.page,
        };
        return result;
      }
      if (params.rating == 3) {
        const result: DataWithPaginationMeta<UserEntity[]> = {
          data: usersData.filter((a) => a.getPropsCopy().rating >= 3),
          count,
          limit: pagination?.limit,
          page: pagination?.page,
        };
        return result;
      }
      if (params.rating == 4) {
        const result: DataWithPaginationMeta<UserEntity[]> = {
          data: usersData.filter((a) => a.getPropsCopy().rating >= 4),
          count,
          limit: pagination?.limit,
          page: pagination?.page,
        };
        return result;
      }
      if (params.rating == 5) {
        const result: DataWithPaginationMeta<UserEntity[]> = {
          data: usersData.filter((a) => a.getPropsCopy().rating == 5),
          count,
          limit: pagination?.limit,
          page: pagination?.page,
        };
        return result;
      }
    }

    const result: DataWithPaginationMeta<UserEntity[]> = {
      data: usersData,
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async findById(id: string | ID): Promise<UserEntity> {
    return this.repository
      .findOne({
        where: { id: id instanceof ID ? id.value : id },
        relations: this.relations,
      })
      .then((u) => this.mapAvatar(u))
      .then((u) => this.mapper.toDomainEntity(u));
  }

  async mapAvatar(user: UserOrmEntity): Promise<UserOrmEntity> {
    const avatar: MediaOrmEntity =
      await this.mediaRepository.getMediaByTypeAndTypeId(user.id, 'avatar');
    user.avatar = avatar;
    return user;
  }
  async findOneByEmail(email: string): Promise<UserOrmEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findByUsername(
    username: string,
    type: string,
  ): Promise<UserEntity | undefined> {
    const userData = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.metadata', 'users_metadata')
      .where('users_metadata.value = :username', { username: username })
      .andWhere('users.type = :type', { type: type })
      .getOne();
    if (!userData) {
      throw new NotFoundException();
    }
    return this.mapper.toDomainEntity(userData);
  }

  async findOneByLegacyId(legacyId: number): Promise<UserEntity> {
    return this.findOne({ legacyId });
  }

  async findOneByLegacyIdOrThrow(legacyId: number): Promise<UserEntity> {
    return this.findOneOrThrow({ legacyId });
  }

  async findOneByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    return this.mapper.toDomainEntity(user);
  }
  async findOneByEmailAndTypeOrThrow(
    email: string,
    type: string,
  ): Promise<UserEntity> {
    const user = await this.findOne({
      email,
      type: UserType[type.toUpperCase()],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findOneByEmailAndType(
    email: string,
    type: string,
  ): Promise<UserOrmEntity | undefined> {
    const user = await this.findOne({
      email,
      type: UserType[type.toUpperCase()],
    });
    if (user) {
      return this.mapper.toOrmEntity(user);
    }
    return undefined;
  }
  async exists(email: string, type: string): Promise<boolean> {
    const found = await this.findOneByEmailAndType(email, type);
    if (found) {
      return true;
    }
    return false;
  }
  // Used to construct a query
  protected prepareQuery(
    params: QueryParams<UserProps>,
  ): WhereCondition<UserOrmEntity> {
    const where: QueryParams<UserOrmEntity> = {};

    if (params.id) {
      where.id = params.id.value;
    }

    if (params.appleId) {
      where.appleId = params.appleId;
    }

    if (params.googleId) {
      where.googleId = params.googleId;
    }

    if (params.facebookId) {
      where.facebookId = params.facebookId;
    }
    if (params.phoneNumber) {
      where.phoneNumber = params.phoneNumber;
    }
    if (params.email) {
      where.email = params.email;
    }

    if (params.legacyId) {
      where.legacyId = params.legacyId;
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.username) {
      where.username = params.username;
    }

    return where;
  }
}
