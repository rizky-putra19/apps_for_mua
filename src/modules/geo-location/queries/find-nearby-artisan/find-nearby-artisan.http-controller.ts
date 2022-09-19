import { Result } from '@badrap/result';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataAndCountMeta } from '@src/libs/ddd/domain/ports/repository.ports';
import { DataListResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-list-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { GeoLocationEntity } from '../../domain/entities/geo-location.entity';
import { GeoLocationDetailResponse } from '../../dtos/geo-location.dto';
import { FindNearbyArtisanQuery } from './find-nearby-artisan.query';
import { FindNearbyArtisanRequest } from './find-nearby-artisan.request';

@Controller({
  version: '1',
  path: 'geo-location',
})
export class FindNearbyArtisanHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/nearby-artisan')
  @UseGuards(AuthGuard('custom'))
  async find(
    @User() user: UserEntity,
    @Body() request: FindNearbyArtisanRequest,
  ) {
    const result: Result<DataAndCountMeta<GeoLocationEntity[]>> =
      await this.queryBus.execute(
        new FindNearbyArtisanQuery({
          user,
          geoLocation: request,
        }),
      );

    return result.unwrap((r) => {
      const { count, data } = r;
      return new DataListResponseBase(
        data.map((d) => new GeoLocationDetailResponse(d)),
        { count },
      );
    });
  }
}
