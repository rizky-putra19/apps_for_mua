import { Result } from '@badrap/result';
import { CommandHandler } from '@nestjs/cqrs';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler-base';
import { GeoLocationRepository } from '../../database/geo-location.repository';
import { GeoLocationHistoryEntity } from '../../domain/entities/geo-location-history.entity';
import { GeoLocationEntity } from '../../domain/entities/geo-location.entity';
import { CreateUpdateGeoLocationCommand } from './create-update-geo-location.command';

@CommandHandler(CreateUpdateGeoLocationCommand)
export class CreateUpdateGeoLocationCommandHandler extends CommandHandlerBase {
  constructor(
    protected readonly unitOfWork: UnitOfWork,
    protected readonly geoLocationRepository: GeoLocationRepository,
  ) {
    super(unitOfWork);
  }
  async handle(
    command: CreateUpdateGeoLocationCommand,
  ): Promise<Result<GeoLocationEntity, Error>> {
    try {
      const { user, geoLocation } = command;

      // check entity exist
      const exist = await this.geoLocationRepository.exist(user.id.value);

      // update entity geo location
      if (exist) {
        const geoLocationEntity =
          await this.geoLocationRepository.findOneByArtisanId(user.id.value);

        // insert histories
        const histories = geoLocationEntity.histories;
        histories.push(
          new GeoLocationHistoryEntity({
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude,
            point: `POINT(${geoLocation.latitude} ${geoLocation.longitude})`,
          }),
        );

        const newGeoLocation = new GeoLocationEntity({
          id: geoLocationEntity.id,
          artisan: user,
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
          point: `POINT(${geoLocation.latitude} ${geoLocation.longitude})`,
          histories,
        });

        const updated = await this.geoLocationRepository.save(newGeoLocation);
        const result = GeoLocationEntity.convertToDomainEntity(updated);

        return Result.ok(result);
      }

      // create new entity
      const histories: GeoLocationHistoryEntity[] = [];
      histories.push(
        new GeoLocationHistoryEntity({
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
          point: `POINT(${geoLocation.latitude} ${geoLocation.longitude})`,
        }),
      );

      const geoLocationEntity = GeoLocationEntity.create({
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        artisan: user,
        point: `POINT(${geoLocation.latitude} ${geoLocation.longitude})`,
        histories,
      });

      const created = await this.geoLocationRepository.save(geoLocationEntity);
      const result = GeoLocationEntity.convertToDomainEntity(created);

      return Result.ok(result);
    } catch (error) {
      return Result.err(error);
    }
  }
}
