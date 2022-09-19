import { Get, Controller, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { DataResponseBase } from '@src/libs/ddd/interface-adapters/base-classes/data-response.base';
import { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceResponse } from '../../dtos/service.dto';
import { GetServiceQuery } from './get-service.query';
import { Result } from '@badrap/result';

@Controller({
  version: '1',
  path: '/services',
})
export class GetServiceHttpController {
  constructor(protected readonly queryBus: QueryBus) {}

  @Get('/:serviceID')
  async show(
    @Param('serviceID') serviceID: string,
  ): Promise<DataResponseBase<ServiceResponse, Error>> {
    const query = new GetServiceQuery({
      serviceID: serviceID,
    });
    const result: Result<ServiceEntity, Error> = await this.queryBus.execute(
      query,
    );

    return new DataResponseBase(result.unwrap((s) => new ServiceResponse(s)));
  }
}
