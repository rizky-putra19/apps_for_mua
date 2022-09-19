import { Body, Controller, Param, Patch } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { UpdateUserRequest } from "./update-user.request.dto";
import { UpdateUserCommand } from "./update-user.command";
import { Result } from "@badrap/result";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserNotFoundError } from "../../errors/user.errors";
import { NotFoundException } from "@src/libs/exceptions";
import { UserResponse } from "../../dtos/user.response.dto";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";

@Controller({
    version: '1',
    path: routesApiV1.app.users.root,
})
export class UpdateUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Patch('/:id')
    async update(@Param('id') id: string, @Body() body: UpdateUserRequest) {
        const command = new UpdateUserCommand({
            id: id,
            email: body.email,
            password: body.password,
            name: body.name,
            type: body.type,
            phoneNumber: body.phoneNumber,
            status: body.status,
        });

        const result: Result<UserEntity, UserNotFoundError> = 
        await this.commandBus.execute(command);
        
        return new DataResponseBase(
            result.unwrap(
                (u) => new UserResponse(u),
                (error) => {
                    if (error instanceof UserNotFoundError) {
                    throw new NotFoundException(error.message)
                }
                throw error;
                },
            )
        );
    }
}