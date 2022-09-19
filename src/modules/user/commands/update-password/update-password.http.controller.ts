import { Body, Controller, Param, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { routesApiV1 } from "@src/infrastructure/configs/app.routes";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserNotFoundError } from "../../errors/user.errors";
import { UpdatePasswordCommand } from "./update-password.command";
import { UpdatePasswordRequest } from "./update-password.request.dto";
import { Result } from "@badrap/result";
import { DataResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/data-response.base";
import { UserResponse } from "../../dtos/user.response.dto";
import { NotFoundException } from "@src/libs/exceptions";

@Controller({
    version: '1',
    path: routesApiV1.app.users.root,
})

export class UpdatePasswordHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(':userID/update-password')
    async updatePassword(@Param('userID') userID: string ,@Body() body: UpdatePasswordRequest) {
        const command = new UpdatePasswordCommand({
            userID: userID,
            password: body.password,
        });

        const result: Result<UserEntity, UserNotFoundError> =
        await this.commandBus.execute(command);

        return new DataResponseBase(
            result.unwrap(
                (u) => new UserResponse(u),
                (error) => {
                    if (error instanceof UserNotFoundError) {
                        throw new NotFoundException(error.message);
                    }
                    console.log(error);
                    throw error;
                },
            ),
        );
    }
}
