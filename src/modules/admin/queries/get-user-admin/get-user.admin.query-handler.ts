import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { QueryHandlerBase } from "@src/libs/ddd/domain/base-classes/query-handler.base";
import { AdminRepository } from "../../database/admin.repository";
import { GetAdminQuery } from "./get-user.admin.query";
import { AdminEntity } from '../../domain/entities/admin.entity';
import { UserNotFoundError } from '@src/modules/user/errors/user.errors';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAdminQuery)
export class GetAdminQueryHandler extends QueryHandlerBase {
    constructor(private readonly adminRepo: AdminRepository) {
        super();
    }

    async handle(
        query: GetAdminQuery,
    ): Promise<Result<AdminEntity, UserNotFoundError>> {
        try {
            const user = await this.adminRepo.findOneByIdOrThrow(query.id);
            return Result.ok(user);
        } catch (error) {
            if (error.response.status == 404) {
                return Result.err(new UserNotFoundError());
            }
            return Result.err(error);
        }
    }
}
