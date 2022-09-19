import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { ID } from "@src/libs/ddd/domain/value-objects/id.value-object";
import { UserAlreadyExistsError } from "@src/modules/user/errors/user.errors";
import { AdminStatus } from "../../domain/enums/admin-status.enum";
import { CreateAdminRequest } from "./create-admin.request.dto";
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { IdResponse } from "@src/libs/ddd/interface-adapters/dtos/id.response.dto";
import { CreateAdminCommand } from "./create-admin.command";

@Controller({
    version: '1',
    path: routesApiV1.app.admins.root,
})
export class CreateAdminHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    async create(@Body() body: CreateAdminRequest) {
        const command = new CreateAdminCommand({
            email: body.email,
            name: body.name,
            password: body.password,
            status: AdminStatus.ACTIVE,
        });
        const result: Result<ID, UserAlreadyExistsError> =
        await this.commandBus.execute(command);
        return result.unwrap(
            (id) => new DataResponseBase(new IdResponse(id.value)),
            (error) => {
                if (error instanceof UserAlreadyExistsError) {
                    throw new UserAlreadyExistsError(); 
                }
                throw error;
            },
        );
    }
}
