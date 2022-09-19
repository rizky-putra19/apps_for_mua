import { Result } from "@badrap/result";
import { CommandHandler } from "@nestjs/cqrs";
import { UnitOfWork } from "@src/infrastructure/database/unit-of-work/unit-of-work";
import { CommandHandlerBase } from "@src/libs/ddd/domain/base-classes/command-handler-base";
import { UUID } from "@src/libs/ddd/domain/value-objects/uuid.value-object";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { genSaltSync, hashSync } from "bcrypt";
import { AdminRepository } from "../../database/admin.repository";
import { AdminEntity, AdminProps } from "../../domain/entities/admin.entity";
import { UpdateAdminCommand } from "./update-admin.command";

@CommandHandler(UpdateAdminCommand)
export class UpdateAdminCommandHandler extends CommandHandlerBase {
    constructor(protected readonly unitOfWork: UnitOfWork) {
        super(unitOfWork);
    }

    async handle(
        command: UpdateAdminCommand,
    ): Promise<Result<AdminEntity, UserNotFoundError>> {
        try {
            const salt = genSaltSync(12);
            const AdminRepo: AdminRepository = this.unitOfWork.getAdminRepository(
                command.correlationId
                );
            const user = await AdminRepo.findOneOrThrow({ id: new UUID(command.id) });

            const userData = user.getPropsCopy();

            const updateData: AdminProps = {
                email: command.email,
                name: command.name,
                password: command.password != null 
                ? hashSync(command.password, salt)
                : userData.password,
                status: userData.status,
            }

            const updated = await AdminRepo.save(
                new AdminEntity({id: user.id, props: updateData})
            );

            return Result.ok(updated);
        } catch (error) {
            return Result.err(error);
        }
    }
}
