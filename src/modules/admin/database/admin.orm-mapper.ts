import { EntityProps, OrmEntityProps, OrmMapper } from "@src/libs/ddd/infrastructure/database/base-classes/orm-mapper.base";
import { AdminEntity, AdminProps } from "../domain/entities/admin.entity";
import { AdminOrmEntity } from "./admin.orm-entity";
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';

export class AdminOrmMapper extends OrmMapper<AdminEntity, AdminOrmEntity> {
    protected toOrmProps(entity: AdminEntity): OrmEntityProps<AdminOrmEntity> {
        const props = entity.getPropsCopy();

        return {
            email: props.email,
            password: Buffer.from(props.password),
            name: props.name,
            status: props.status,
        };
    }

    protected toDomainProps(ormEntity: AdminOrmEntity): EntityProps<AdminProps> {
        const id = new UUID(ormEntity.id);
        const props: AdminProps = {
            email: ormEntity.email,
            name: ormEntity.name,
            password: ormEntity.password.toString(),
            status: ormEntity.status,
        };
        return {
            id,
            props,
        };
    }
}
