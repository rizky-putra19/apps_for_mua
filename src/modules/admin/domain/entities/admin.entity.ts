import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { genSaltSync, hashSync } from 'bcrypt';
import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';

export interface AdminProps {
    email: string;
    name: string;
    password: string;
    status: string;
}

export class AdminEntity extends AggregateRoot<AdminProps> {
    protected readonly _id: UUID;

    static create(request: AdminProps): AdminEntity {
        const id = UUID.generate();
        const salt = genSaltSync(12);
        const props: AdminProps = {
            email: request.email,
            password: hashSync(request.password, salt),
            name: request.name,
            status: request.status, 
        };

        const admin = new AdminEntity({ id, props});
        return admin;
    }
}
