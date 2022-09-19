import { Result } from "@badrap/result";
import { Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { AdminResponse } from "../../dtos/admin.response.dto";
import { FindAdminQuery } from "./find-user.admin.query";
import { FindAdminRequest } from "./find-user.admin.request.dto";

@Controller({
    version: '1',
    path: routesApiV1.app.admins.root,
})
export class FindAdminHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Post('/find')
    async findUser(@Body() request: FindAdminRequest) {
        const query = new FindAdminQuery({
            identifier: request.identifier,
            findType: request.findType,
        });

        const result: Result<AdminEntity, UserNotFoundError> =
          await this.queryBus.execute(query);

        return new DataResponseBase(
            result.unwrap(
                (u) => new AdminResponse(u),
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
