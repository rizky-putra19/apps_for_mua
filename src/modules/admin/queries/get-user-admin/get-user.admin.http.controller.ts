import { Controller, Get, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { NotFoundException } from "@src/libs/exceptions";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { AdminResponse } from "../../dtos/admin.response.dto";
import { GetAdminQuery } from "./get-user.admin.query";
import { Result } from '@src/libs/ddd/domain/utils/result.util';

@Controller({
    version: '1',
    path: routesApiV1.app.admins.show,
})
export class GetAdminHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get()
    async show(
        @Param('id') id: string,
    ): Promise<DataResponseBase<AdminResponse, any>> {
        const query = new GetAdminQuery({ id });
        const result: Result<AdminEntity> = await this.queryBus.execute(query);
        return new DataResponseBase(
            result.unwrap(
                (a) => new AdminResponse(a),
                (error) => {
                    if (error instanceof UserNotFoundError) {
                        throw new NotFoundException(error.message);
                    }
                    throw error;
                },
            ),
        );
    }
}
