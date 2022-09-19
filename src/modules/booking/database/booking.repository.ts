import { Logger } from '@nestjs/common';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntityProps } from '@src/libs/ddd/domain/base-classes/entity.base';
import {
  FindManyPaginatedParams,
  DataWithPaginationMeta,
  FindManyPaginatedSearch,
  DataAndCountMeta,
} from '@src/libs/ddd/domain/ports/repository.ports';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { DeepPartial } from '@src/libs/types';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Between, Brackets, Repository } from 'typeorm';
import { BookingStatusEntity } from '../domain/entities/booking-status.entity';
import { BookingEntity, BookingProps } from '../domain/entities/booking.entity';
import { BookingStatus } from '../domain/enums/booking-status.enum';
import { BookingStatusHistoryOrmEntity } from './booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from './booking-status.orm-entity';
import { BookingOrmEntity } from './booking.orm-entity';
import { BookingOrmMapper } from './booking.orm-mapper';

export class BookingRepository extends TypeormRepositoryBase<
  BookingEntity,
  BookingProps,
  BookingOrmEntity
> {
  protected relations: string[] = [
    'services',
    'venue',
    'artisan',
    'customer',
    'status',
    'histories',
    'histories.status',
    'services.service',
    'services.service.artisan',
    'services.service.category',
  ];
  constructor(
    @InjectRepository(BookingOrmEntity)
    readonly bookingRepository: Repository<BookingOrmEntity>,
    readonly userRepository: UserRepository,
    @InjectRepository(BookingStatusOrmEntity)
    readonly bookingStatusRepository: Repository<BookingStatusOrmEntity>,
    @InjectRepository(BookingStatusHistoryOrmEntity)
    readonly bookingStatusHistoryRepository: Repository<BookingStatusHistoryOrmEntity>,
  ) {
    super(
      bookingRepository,
      new BookingOrmMapper(BookingEntity, BookingOrmEntity),
      new Logger('BookingRepository'),
    );
  }

  async findOneByIdOrThrow(id: string | ID): Promise<BookingEntity> {
    const booking = await this.repository.findOne(
      {
        id: id instanceof ID ? id.value : id,
      },
      { relations: this.relations },
    );
    const customer = await this.userRepository.findById(booking.customer.id);
    const artisan = await this.userRepository.findById(booking.artisan.id);
    booking.customer = UserOrmMapper.convertToOrmEntity(customer);
    booking.artisan = UserOrmMapper.convertToOrmEntity(artisan);
    return this.mapper.toDomainEntity(booking);
  }

  async findOneByCodeorThrow(code: string): Promise<BookingEntity> {
    const booking = await this.repository.findOne({
      where: {
        code,
      },
      relations: this.relations,
    });
    const customer = await this.userRepository.findById(booking.customer.id);
    const artisan = await this.userRepository.findById(booking.artisan.id);
    booking.customer = UserOrmMapper.convertToOrmEntity(customer);
    booking.artisan = UserOrmMapper.convertToOrmEntity(artisan);
    return this.mapper.toDomainEntity(booking);
  }

  async findManyPaginated({
    where,
    pagination,
    order,
  }: FindManyPaginatedParams<BookingOrmEntity>): Promise<
    DataWithPaginationMeta<BookingEntity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where,
      order,
      relations: this.relations,
    });
    const result: DataWithPaginationMeta<BookingEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const customer = await this.userRepository.findById(item.customer.id);
          const artisan = await this.userRepository.findById(item.artisan.id);

          item.customer = UserOrmMapper.convertToOrmEntity(customer);
          item.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async findManyWithSearch({
    params,
    pagination,
  }: FindManyPaginatedSearch): Promise<
    DataWithPaginationMeta<BookingEntity[]>
  > {
    const qb = this.createQueryBuilder('bookings')
      .leftJoinAndSelect('bookings.services', 'booking_services')
      .leftJoinAndSelect('bookings.venue', 'booking_venues')
      .leftJoinAndSelect('bookings.status', 'booking_status')
      .leftJoinAndSelect('bookings.artisan', 'artisan')
      .leftJoinAndSelect('bookings.customer', 'customer')
      .leftJoinAndSelect('booking_services.service', 'services')
      .leftJoinAndSelect('services.artisan', 'users')
      .leftJoinAndSelect('services.category', 'categories')
      .leftJoinAndSelect('categories.parent', 'parent')
      .leftJoinAndSelect('parent.parent', 'top_parent');
    if (params.users) {
      if (
        params.users.props.type == 'artisan' ||
        params.users.props.type == 'customer'
      ) {
        qb.where(
          new Brackets((qb) => {
            qb.where('bookings.customer.id = :users', {
              users: params.users.id.value,
            }).orWhere('bookings.artisan.id = :users', {
              users: params.users.id.value,
            });
          }),
        );
      }
    }

    if (params.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            'MATCH(bookings.eventName, bookings.name)against(:search IN BOOLEAN MODE)',
            {
              search: params.search,
            },
          ).orWhere(
            `MATCH(users.username)against(:search IN BOOLEAN MODE) AND users.type = 'artisan'`,
            {
              search: params.search,
            },
          );
        }),
      );
    }

    if (params.statuses) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('bookings.status in (:statuses)', {
            statuses: params.statuses,
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

    if (params.services) {
      qb.orWhere(
        new Brackets((qb) => {
          qb.where('categories.id in (:services)', {
            services: params.services,
          });
        }),
      );
    }

    if (params.eventDate) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('bookings.eventDate >= :startDate', {
            startDate: params.startDate,
          }).andWhere('bookings.eventDate <= :toDate', {
            toDate: params.toDate,
          });
        }),
      );
    }

    if (params.createdDate) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('bookings.createdAt >= :startDate', {
            startDate: params.startDate,
          }).andWhere('bookings.createdAt <= :toDate', {
            toDate: params.toDate,
          });
        }),
      );
    }

    if (params.orderBy) {
      if (params.orderBy == 'booking_code') {
        qb.orderBy({ 'bookings.code': params.order });
      }
      if (params.orderBy == 'artisan_name') {
        qb.orderBy({ 'artisan.name': params.order });
      }
      if (params.orderBy == 'artisan_username') {
        qb.orderBy({ 'artisan.username': params.order });
      }
      if (params.orderBy == 'customer_name') {
        qb.orderBy({ 'customer.name': params.order });
      }
      if (params.orderBy == 'services') {
        qb.orderBy({ 'categories.name': params.order });
      }
      if (params.orderBy == 'category') {
        qb.orderBy({
          'top_parent.name': params.order,
        });
      }
      if (params.orderBy == 'type') {
        qb.orderBy({
          'parent.name': params.order,
        });
      }
      if (params.orderBy == 'service_fee') {
        qb.orderBy({ 'bookings.grandTotal': params.order });
      }
      if (params.orderBy == 'event_date') {
        qb.orderBy({ 'bookings.eventDate': params.order });
      }
      if (params.orderBy == 'created_date') {
        qb.orderBy({ 'bookings.createdAt': params.order });
      }
      if (params.orderBy == 'updated_date') {
        qb.orderBy({ 'bookings.updatedAt': params.order });
      }
      if (params.orderBy == 'status') {
        qb.orderBy({ 'booking_status.description': params.order });
      }
    }

    const [data, count] = await qb
      .skip(pagination?.skip)
      .take(pagination?.limit)
      .getManyAndCount();

    const result: DataWithPaginationMeta<BookingEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const customer = await this.userRepository.findById(item.customer.id);
          const artisan = await this.userRepository.findById(item.artisan.id);
          const histories = await this.bookingStatusHistoryRepository.find({
            where: { booking: { id: item.id } },
            relations: ['status'],
            order: {
              createdAt: 'DESC',
            },
          });

          item.customer = UserOrmMapper.convertToOrmEntity(customer);
          item.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          item.histories = histories;
          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async findStatusById(id: number): Promise<BookingStatusEntity> {
    const status = await this.bookingStatusRepository.findOne({ id });
    return BookingStatusEntity.convertToDomainEntity(status);
  }

  async findByStatus(status: BookingStatus): Promise<BookingStatusEntity> {
    const found = await this.bookingStatusRepository.findOne({ status });
    return BookingStatusEntity.convertToDomainEntity(found);
  }

  async countJobDone(artisanID: string): Promise<number> {
    const status = await this.findByStatus(BookingStatus.COMPLETED);
    const [data, count] = await this.repository.findAndCount({
      status,
      artisan: {
        id: artisanID,
      },
    });
    return count;
  }

  async checkArtisanSchedule(
    artisanID: string,
    month: number,
  ): Promise<DataAndCountMeta<BookingEntity[]>> {
    const date = new Date();
    const firstDate = moment(
      new Date(date.getFullYear(), Number(month), 1),
    ).format('YYYY-MM-DD');

    const lastDate = moment(
      new Date(date.getFullYear(), Number(month) + 1, 1),
    ).format('YYYY-MM-DD');

    const [data, count] = await this.repository.findAndCount({
      where: {
        artisan: {
          id: artisanID,
        },
        eventDate: Between(firstDate, lastDate),
      },
      relations: this.relations,
    });

    const result: DataAndCountMeta<BookingEntity[]> = {
      data: await Promise.all(
        data.map(async (item) => {
          const customer = await this.userRepository.findById(item.customer.id);
          const artisan = await this.userRepository.findById(item.artisan.id);

          item.customer = UserOrmMapper.convertToOrmEntity(customer);
          item.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          return this.mapper.toDomainEntity(item);
        }),
      ),
      count,
    };

    return result;
  }

  protected prepareQuery(
    params: DeepPartial<BaseEntityProps & BookingProps>,
  ): WhereCondition<BookingOrmEntity> {
    throw new Error('Method not implemented.');
  }
}
