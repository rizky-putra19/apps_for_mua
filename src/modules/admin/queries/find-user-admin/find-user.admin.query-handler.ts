import { Result } from "@badrap/result";
import { QueryHandler } from "@nestjs/cqrs";
import { QueryHandlerBase } from "@src/libs/ddd/domain/base-classes/query-handler.base";
import { UUID } from "@src/libs/ddd/domain/value-objects/uuid.value-object";
import { UserNotFoundError } from "@src/modules/user/errors/user.errors";
import { AdminRepository } from "../../database/admin.repository";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { FindAdminQuery } from "./find-user.admin.query";

@QueryHandler(FindAdminQuery)
export class FindAdminQueryHandler extends QueryHandlerBase {
    constructor(private readonly adminRepo: AdminRepository
        ) {
        super()
    }

    async handle(
        query: FindAdminQuery,
    ): Promise<Result<AdminEntity, UserNotFoundError>> {
        try {
            const user = await this.handleFind(
                query.findType,
                query.identifier,
            )

            if (user == undefined) {
                return Result.err(new UserNotFoundError());
            }

            return Result.ok(user);
        } catch (error) {
            if (error.response.status == 404) {
                return Result.err(new UserNotFoundError());
            }
            return Result.err(error);
        }
    }

    async handleFind(
        type: string,
        identifier: string,
    ): Promise<AdminEntity | undefined> {
        let user: any;
        switch (type) {
            case 'email':
              user = await this.adminRepo.findOneByEmailOrThrow(identifier);
              break;
            case 'id':
              user = await this.adminRepo.findOne({ id: new UUID(identifier) });
              break;
        }
        return user;
    }
}
