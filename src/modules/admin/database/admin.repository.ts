import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderBy, QueryParams } from "@src/libs/ddd/domain/ports/repository.ports";
import { TypeormRepositoryBase,
WhereCondition, } from "@src/libs/ddd/infrastructure/database/base-classes/typeorm.repository.base";
import { Repository } from "typeorm";
import { AdminEntity, AdminProps } from "../domain/entities/admin.entity";
import { AdminOrmEntity } from "./admin.orm-entity";
import { AdminOrmMapper } from "./admin.orm-mapper";
import { AdminRepositoryPort } from "./admin.repository.port";

@Injectable()
export class AdminRepository
    extends TypeormRepositoryBase<AdminEntity, AdminProps, AdminOrmEntity>
    implements AdminRepositoryPort
{
    protected relations: string[];
    constructor(
        @InjectRepository(AdminOrmEntity)
        private readonly adminRepository: Repository<AdminOrmEntity>,
    ) {
        super(
            adminRepository,
            new AdminOrmMapper(AdminEntity, AdminOrmEntity),
            new Logger('AdminRepository'),
        );
    }
    async findOneByEmail(email: string): Promise<AdminOrmEntity | undefined> {
        const user = await this.adminRepository.findOne({
            where: { email },
        });
        return user;
    }

    async findOneByEmailOrThrow(email: string): Promise<AdminEntity> {
        const user = await this.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException();
        }
        return this.mapper.toDomainEntity(user);
    }

    async isExist (email: string): Promise<boolean> {
        const found = await this.findOneByEmail(email);
        if (found) {
            return true;
        }
        return false;
    }

    protected prepareQuery(
        params: QueryParams<AdminProps>,
    ): WhereCondition<AdminOrmEntity> {
        const where: QueryParams<AdminOrmEntity> = {};
        if (params.email) {
            where.email = params.email;
        }

        if (params.id) {
            where.id = params.id.value;
        }

        if (params.status) {
            where.status = params.status;
        }
        return where;
    }
}
