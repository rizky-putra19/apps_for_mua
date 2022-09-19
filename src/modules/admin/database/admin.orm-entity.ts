import { TypeormEntityBase } from "@src/libs/ddd/infrastructure/database/base-classes/typeorm.entity.base";
import { Column, Entity, Index } from "typeorm";
import { AdminStatus } from "../domain/enums/admin-status.enum";

@Entity('admins')
@Index('email_uniq_idx', ['email'], {unique: true})
export class AdminOrmEntity extends TypeormEntityBase {
    constructor(props?: AdminOrmEntity) {
        super(props);
    }
    @Column()
    email: string;

    @Column()
    password: Buffer;

    @Column({ nullable: true })
    name?: string;

    @Column({
        type: 'enum',
        nullable: true,
        enum: AdminStatus,
        default: AdminStatus.ACTIVE,
    })
    status?: string;

}
