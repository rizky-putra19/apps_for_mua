import { ApiProperty } from "@nestjs/swagger";
import { ResponseBase } from "@src/libs/ddd/interface-adapters/base-classes/response.base";
import { AdminEntity } from "../domain/entities/admin.entity";

export class AdminResponse extends ResponseBase {
    @ApiProperty({
        example: 'john-deo@gmail.com',
        description: 'user email address',
    })
    readonly email: string;

    @ApiProperty({
        description: 'user name',
    })
    readonly name?: string;

    @ApiProperty({
        description: 'user status',
    })
    readonly status: string;

    constructor(user: AdminEntity) {
        super(user)
        const props = user.getPropsCopy();
        this.email = props.email;
        this.name = props.name;
        this.status = props.status;
    }
}
