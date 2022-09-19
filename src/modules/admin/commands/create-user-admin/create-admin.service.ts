import { CommandHandler } from "@nestjs/cqrs";
import { UnitOfWork } from "@src/infrastructure/database/unit-of-work/unit-of-work";
import { CommandHandlerBase } from "@src/libs/ddd/domain/base-classes/command-handler-base";
import { ID } from "@src/libs/ddd/domain/value-objects/id.value-object";
import { UserAlreadyExistsError } from "@src/modules/user/errors/user.errors";
import { CreateAdminCommand } from "./create-admin.command";
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { AdminRepositoryPort } from "../../database/admin.repository.port";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { AdminStatus } from "../../domain/enums/admin-status.enum";
import { HttpService } from "@nestjs/axios";

@CommandHandler(CreateAdminCommand)
export class CreateAdminService extends CommandHandlerBase {
    constructor(
        protected readonly unitOfWork: UnitOfWork,
        protected readonly httpService: HttpService,
    ) {
        super(unitOfWork)
    }

    async handle( 
        command: CreateAdminCommand,
    ): Promise<Result<ID, UserAlreadyExistsError>> {
        const adminRepo: AdminRepositoryPort = this.unitOfWork.getAdminRepository(
            command.correlationId,
        );
        
        if (
            await adminRepo.isExist(command.email)
            ) {
                return Result.err(new UserAlreadyExistsError());
            }

        const user = AdminEntity.create({
            email: command.email,
            password: command.password,
            name: command.name,
            status: AdminStatus.ACTIVE,
        });

        const created = await adminRepo.save(user);

        return Result.ok(created.id);
    }
}
