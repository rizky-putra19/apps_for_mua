import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { CreateUpdateRequest } from '@src/modules/device/commands/create-update/create-update.request.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { request } from 'http';
import { GeoLocationEntity } from '../../domain/entities/geo-location.entity';
import { GeoLocationResponse } from '../../dtos/geo-location.dto';
import { CreateUpdateGeoLocationCommand } from './create-update-geo-location.command';
import { Result } from '@badrap/result';
import { CreateUpdateGeoLocationRequest } from './create-update-geo-location.request.dto';

@Controller({
  version: '1',
  path: '/geo-location',
})
@UseGuards(AuthGuard('custom'))
export class CreateUpdateGeoLocationHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createUpdate(
    @User() user: UserEntity,
    @Body() request: CreateUpdateGeoLocationRequest,
  ) {
    const result: Result<GeoLocationEntity> = await this.commandBus.execute(
      new CreateUpdateGeoLocationCommand({
        user,
        geoLocation: request,
      }),
    );

    return new DataResponseBase(
      result.unwrap((g) => new GeoLocationResponse(g)),
    );
  }
}
