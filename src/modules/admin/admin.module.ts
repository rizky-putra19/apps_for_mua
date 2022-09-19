import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateAdminHttpController } from "./commands/create-user-admin/create-admin.http.controller";
import { CreateAdminService } from "./commands/create-user-admin/create-admin.service";
import { DeleteAdminCommandHandler } from "./commands/delete-user-admin/delete-admin.command.handler";
import { DeleteAdminHttpController } from "./commands/delete-user-admin/delete-admin.http.controller";
import { UpdateAdminCommandHandler } from "./commands/update-user-admin/update-admin.command-handler";
import { UpdateAdminHttpController } from "./commands/update-user-admin/update-admin.http.controller";
import { AdminOrmEntity } from "./database/admin.orm-entity";
import { AdminRepository } from "./database/admin.repository";
import { FindAdminHttpController } from "./queries/find-user-admin/find-user.admin.http.controller";
import { FindAdminQueryHandler } from "./queries/find-user-admin/find-user.admin.query-handler";
import { GetAdminHttpController } from "./queries/get-user-admin/get-user.admin.http.controller";
import { GetAdminQueryHandler } from "./queries/get-user-admin/get-user.admin.query-handler";

const httpControllers = [
    CreateAdminHttpController,
    UpdateAdminHttpController,
    GetAdminHttpController,
    FindAdminHttpController,
    DeleteAdminHttpController,
];
const repositories = [AdminRepository];
const commandHandlers = [CreateAdminService, UpdateAdminCommandHandler, DeleteAdminCommandHandler];
const queryHandlers = [GetAdminQueryHandler, FindAdminQueryHandler];

@Module({
    imports: [
        TypeOrmModule.forFeature([AdminOrmEntity]),
        CqrsModule, 
        HttpModule
    ],
    controllers: [...httpControllers],
    providers: [
        ...repositories,
        ...commandHandlers,
        ...queryHandlers,
    ],
    exports: [
        ...commandHandlers,
        ...queryHandlers,
    ],
})
export class AdminModule {}
