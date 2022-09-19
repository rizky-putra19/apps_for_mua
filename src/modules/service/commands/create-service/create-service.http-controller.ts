import { Result } from '@badrap/result';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@src/infrastructure/decorators';
import { CustomAuthGuard } from '@src/infrastructure/guards/custom.guard';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceResponse } from '../../dtos/service.dto';
import { CreateServiceCommand } from './create-service.command';
import { CreateServiceRequest } from './create-service.request';

@Controller({
  version: '1',
  path: '/services',
})
export class CreateServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(AuthGuard('custom'))
  @Post()
  async create(
    @User() user: UserEntity,
    @Body() request: CreateServiceRequest,
  ) {
    const result: Result<ServiceEntity> = await this.commandBus.execute(
      new CreateServiceCommand({
        user,
        service: request,
      }),
    );

    return new DataResponseBase(result.unwrap((s) => new ServiceResponse(s)));
  }
}
