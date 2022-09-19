import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { BookingOrmMapper } from '@src/modules/booking/database/booking.orm-mapper';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { UserOrmMapper } from '@src/modules/user/database/user.orm-mapper';
import { UserRepository } from '@src/modules/user/database/user.repository';
import { Repository } from 'typeorm';
import { ReviewEntity } from '../domain/entities/review.entity';
import { ReviewOrmEntity } from './review.orm-entity';
import { ReviewRepositoryPort } from './review.repository.port';

@Injectable()
export class ReviewRepository implements ReviewRepositoryPort {
  constructor(
    @InjectRepository(ReviewOrmEntity)
    private readonly reviewRepository: Repository<ReviewOrmEntity>,
    private readonly userRepository: UserRepository,
    private readonly bookingRepository: BookingRepository,
  ) {}
  protected relations: string[] = ['artisan', 'customer', 'booking'];

  async FindListReview(
    artisanID: string,
  ): Promise<DataAndCountMeta<ReviewEntity[]>> {
    const [data, count] = await this.reviewRepository.findAndCount({
      where: {
        artisan: {
          id: artisanID,
        },
      },
      relations: this.relations,
    });
    const result = {
      data: await Promise.all(
        data.map(async (r) => {
          const customer = await this.userRepository.findById(r.customer.id);
          const artisan = await this.userRepository.findById(r.artisan.id);
          const booking = await this.bookingRepository.findOneByIdOrThrow(
            r.booking.id,
          );

          r.customer = UserOrmMapper.convertToOrmEntity(customer);
          r.artisan = UserOrmMapper.convertToOrmEntity(artisan);
          r.booking = BookingOrmMapper.toOrmEntity(booking);
          return ReviewEntity.convertToDomainEntity(r);
        }),
      ),
      count,
    };
    return result;
  }

  async save(entity: ReviewEntity): Promise<ReviewEntity> {
    const ormEntity = ReviewEntity.convertToOrmEntity(entity);
    const result = await this.reviewRepository.save(ormEntity);

    return ReviewEntity.convertToDomainEntity(result);
  }
}
