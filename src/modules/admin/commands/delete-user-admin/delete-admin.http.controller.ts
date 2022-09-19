import { Body, Controller, Delete, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { IdResponse } from "@src/libs/ddd/interface-adapters/dtos/id.response.dto";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { NotFoundException } from "@src/libs/exceptions";
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { ID } from "@src/libs/ddd/domain/value-objects/id.value-object";
import { DeleteAdminRequest } from "./delete-admin.request.dto";
import { DeleteAdminCommand } from "./delete-admin.command";

@Controller({
    version: '1',
    path: routesApiV1.app.admins.root,
})
export class DeleteAdminHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Delete()
    async delete(@Body() body: DeleteAdminRequest) {
        const command = new DeleteAdminCommand({ id: body.id });
        const result: Result<ID, UserNotFoundError> = await this.commandBus.execute(command);
        return result.unwrap(
            (id) => new DataResponseBase(new IdResponse(id.value)),
            (error) => {
                if (error instanceof UserNotFoundError) {
                    throw new NotFoundException(error.message);
                }
            throw error;
            }
        )
    }
}
