import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { BookingServiceEntity } from '../../domain/entities/booking-service.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { CreateBookingCommand } from './create-booking.command';
import { plainToClass } from 'class-transformer';
import {
  CreateBookingServiceRequest,
  CreateBookingVenueRequest,
} from './create-booking.request';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { BookingVenueEntity } from '../../domain/entities/booking-venue.entity';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import moment from 'moment';
import { UserStatus } from '@src/modules/user/domain/enums/user-status.enum';
import { UserNotVerified } from '@src/modules/user/errors/user.errors';
import { ConfigService } from '@nestjs/config';
import { BookingStatusHistoryEntity } from '../../domain/entities/bookings-status-history.entity';
import { BookingStatus } from '../../domain/enums/booking-status.enum';
import { CodeGenerator } from '@src/libs/utils/code-generator.util';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateBookingCommand)
export class CreateBookingCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly configService: ConfigService,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateBookingCommand,
  ): Promise<Result<BookingEntity, Error>> {
    const serviceRepo = this.unitOfWork.getServiceRepository(
      command.correlationId,
    );
    const bookingRepo = this.unitOfWork.getBookingRepository(
      command.correlationId,
    );
    const userRepo = this.unitOfWork.getUserRepository(command.correlationId);

    const { customer, eventDate, eventName, services, venue, name } = command;
    const venueTransformed = plainToClass(CreateBookingVenueRequest, venue);
    const customerData = await userRepo.findOneByIdOrThrow(customer.id);
    const customerProps = customerData.getPropsCopy();
    if (customerProps.status == UserStatus.UNVERIFIED_EMAIL) {
      throw new UserNotVerified();
    }
    let artisan: UserEntity;

    const serviceEntities: BookingServiceEntity[] = await Promise.all(
      services.map(async (s) => {
        const sC = plainToClass(CreateBookingServiceRequest, s);

        try {
          const service = await serviceRepo.findOneServiceById(
            new UUID(sC.serviceId).value,
          );

          const sProps = service.getPropsCopy();
          artisan = sProps.artisan;
          return BookingServiceEntity.create({
            title: sProps.title,
            price: sProps.price,
            quantity: s.quantity,
            service: service,
            notes: s.notes,
            total: sProps.price * s.quantity,
          });
        } catch (err) {
          throw new BadRequestException(err.message);
        }
      }),
    );

    const venueEntity = BookingVenueEntity.create({
      address: venueTransformed.address,
      latitude: venueTransformed.latitude,
      longitude: venueTransformed.longitude,
      notes: venueTransformed.notes,
      venueName: venueTransformed.venueName,
      extra: venueTransformed.extra,
    });

    const subTotal = serviceEntities
      .map((s) => s.getPropsCopy().total)
      .reduce((curr, prev) => curr + prev);
    const platformFee = this.configService.get<number>('platformFee');
    const grandTotal = Number(subTotal) + Number(platformFee);
    const status = await bookingRepo.findByStatus(
      BookingStatus.WAITING_FOR_CONFIRMATION,
    );
    const histories: BookingStatusHistoryEntity[] = [];
    histories.push(
      new BookingStatusHistoryEntity({
        status,
      }),
    );
    const processCode = CodeGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const bookingEntity = BookingEntity.create({
      artisan: artisan,
      customer: customer,
      eventDate: moment(eventDate).toDate(),
      eventName: eventName,
      name: name,
      services: serviceEntities,
      venue: venueEntity,
      platformFee,
      subTotal,
      grandTotal,
      status,
      histories,
      processCode,
    });

    const result = await bookingRepo.save(bookingEntity);

    // throw new Error('Method not implemented.');
    return Result.ok(result);
  }
}
