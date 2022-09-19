import { Result } from '@badrap/result';
import { QueryHandler } from '@nestjs/cqrs';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { BadRequestException } from '@src/libs/exceptions';
import { GeoLocationRepository } from '../../database/geo-location.repository';
import { GeoLocationEntity } from '../../domain/entities/geo-location.entity';
import { FindNearbyArtisanQuery } from './find-nearby-artisan.query';

@QueryHandler(FindNearbyArtisanQuery)
export class FindNearbyArtisanQueryHandler extends QueryHandlerBase {
  constructor(private readonly geoLocationRepository: GeoLocationRepository) {
    super();
  }
  async handle(
    query: FindNearbyArtisanQuery,
  ): Promise<Result<DataAndCountMeta<GeoLocationEntity[]>, Error>> {
    const { user, geoLocation } = query;
    let { range = 40, duration = 2 } = geoLocation;

    try {
      // only customer can access
      if (user.getPropsCopy().type != 'customer') {
        throw new BadRequestException();
      }

      const artisanGeoLocationList =
        await this.geoLocationRepository.findNearbyArtisan({
          geoLocation: {
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude,
            range,
            duration,
          },
        });

      return Result.ok(artisanGeoLocationList);
    } catch (error) {
      return Result.err(error);
    }
  }
}
