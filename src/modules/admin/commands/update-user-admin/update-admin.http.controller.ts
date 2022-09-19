import { Body, Param, Controller, Patch } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { UpdateAdminRequest } from "./update-admin.request.dto";
import { UpdateAdminCommand } from "./update-admin.command";
import { Result } from "@badrap/result";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { AdminResponse } from "../../dtos/admin.response.dto";
import { NotFoundException } from "@src/libs/exceptions";

@Controller({
    version: '1',
    path: routesApiV1.app.admins.root,
})
export class UpdateAdminHttpController {
    constructor(private readonly commandBus: CommandBus) {};

    @Patch('/:id')
    async update (@Param('id') id: string, @Body() body: UpdateAdminRequest) {
        const command = new UpdateAdminCommand ({
            id: id,
            email: body.email,
            password: body.password,
            name: body.name,
        });

        const result: Result<AdminEntity, UserNotFoundError> =
        await this.commandBus.execute(command);

        return new DataResponseBase(
            result.unwrap(
                (a) => new AdminResponse(a),
                (error) => {
                    if (error instanceof UserNotFoundError) {
                        throw new NotFoundException(error.message);
                    }
                throw error;
                },
            )
        )
    }
}
