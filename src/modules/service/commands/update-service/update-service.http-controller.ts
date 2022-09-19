import { Result } from '@badrap/result';
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceResponse } from '../../dtos/service.dto';
import { UpdateServiceCommand } from './update-service.command';
import { UpdateServiceRequest } from './update-service.request';

@Controller({
  version: '1',
  path: '/services',
})
export class UpdateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(AuthGuard('custom'))
  @Patch('/:serviceID')
  async edit(
    @User() user: UserEntity,
    @Param('serviceID') serviceID: string,
    @Body() request: UpdateServiceRequest,
  ) {
    const result: Result<ServiceEntity> = await this.commandBus.execute(
      new UpdateServiceCommand({
        serviceID,
        user,
        service: request,
      }),
    );

    return new DataResponseBase(result.unwrap((s) => new ServiceResponse(s)));
  }
}
