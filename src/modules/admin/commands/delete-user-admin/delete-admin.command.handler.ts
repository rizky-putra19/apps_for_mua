import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { AdminRepository } from "../../database/admin.repository";
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { AdminEntity } from "../../domain/entities/admin.entity";
import { UUID } from "@src/libs/ddd/domain/value-objects/uuid.value-object";
import { UnitOfWork } from "@src/infrastructure/database/unit-of-work/unit-of-work";
import { CommandHandler } from "@nestjs/cqrs";
import { DeleteAdminCommand } from "./delete-admin.command";
import { CommandHandlerBase } from "@src/libs/ddd/domain/base-classes/command-handler-base";
import { ID } from "@src/libs/ddd/domain/value-objects/id.value-object";

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminCommandHandler extends CommandHandlerBase {
    constructor(protected readonly unitOfWork: UnitOfWork) {
        super(unitOfWork);
    }

    async handle(
        command: DeleteAdminCommand,
    ): Promise<Result<ID, UserNotFoundError>> {
        try {
            const adminRepo: AdminRepository = this.unitOfWork.getAdminRepository(
                command.correlationId,
            );
            const user = await adminRepo.findOneOrThrow({ id: new UUID(command.id)} );
            const userData = user.getPropsCopy();
            const deleted = await adminRepo.delete(
                new AdminEntity({id: user.id, props: userData}),
            )
            return Result.ok(deleted.id);
        } catch (error) {
            return Result.err(error);
        }
    }
}
