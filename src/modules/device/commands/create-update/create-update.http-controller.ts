import { Result } from '@badrap/result';
import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '@src/infrastructure/decorators';
import { AllowGuestGuard } from '@src/infrastructure/guards/allowguest.guard';
import { CustomAuthGuard } from '@src/infrastructure/guards/custom.guard';

import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { IdResponse } from '@src/libs/ddd/interface-adapters/dtos/id.response.dto';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { DeviceEntity } from '../../domain/entities/device.entity';
import { CreateUpdateCommand } from './create-update.command';
import { CreateUpdateRequest } from './create-update.request.dto';

@Controller({
  path: '/devices',
  version: '1',
})
export class CreateUpdateHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AllowGuestGuard)
  async create(
    @Body() request: CreateUpdateRequest,
    @Headers() headers: { [key: string]: any },
    @User() user?: UserEntity,
  ) {
    const result: Result<DeviceEntity> = await this.commandBus.execute(
      new CreateUpdateCommand({
        deviceId: request.deviceId,
        pushToken: request.pushToken,
        user,
        platform: headers['platform'] || 'web',
        type: UserType[request.type.toUpperCase()],
      }),
    );

    return new DataResponseBase(
      result.unwrap((d) => new IdResponse(d.id.value)),
    );
  }
}
