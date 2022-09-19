import { Result } from "@badrap/result";
import { CommandHandler } from "@nestjs/cqrs";
import { UnitOfWork } from "@src/infrastructure/database/unit-of-work/unit-of-work";
import { CommandHandlerBase } from "@src/libs/ddd/domain/base-classes/command-handler-base";
import { DateVO } from "@src/libs/ddd/domain/value-objects/date.value-object";
import { UUID } from "@src/libs/ddd/domain/value-objects/uuid.value-object";
import { genSaltSync, hashSync } from "bcrypt";
import { UserRepository } from "../../database/user.repository";
import { UserEntity, UserProps } from "../../domain/entities/user.entity";
import { UserNotFoundError } from "../../errors/user.errors";
import { UpdatePasswordCommand } from "./update-password.command";


@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler extends CommandHandlerBase {
    constructor(protected readonly unitOfWork: UnitOfWork) {
        super(unitOfWork);
    }
    async handle(
        command: UpdatePasswordCommand,
    ): Promise<Result<UserEntity, UserNotFoundError>> {
        try {
            const salt = genSaltSync(12);
            const userRepo: UserRepository = this.unitOfWork.getUserRepository(
                command.correlationId,
            );

            const user = await userRepo.findOneOrThrow({ id: new UUID(command.userID) });
            
            const updateData: UserProps = {
                ...user.getPropsCopy(),
                password: hashSync(command.password, salt),
            };

            const updateUser = await userRepo.save(
                new UserEntity({ id: user.id, props: updateData }),
            )
            
            return Result.ok(updateUser);
        } catch (error) {
            return Result.err(error);
        }
    }
}
