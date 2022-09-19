import { Command, CommandProps } from "@src/libs/ddd/domain/base-classes/command-base";
import { AdminStatus } from "../../domain/enums/admin-status.enum";

export class CreateAdminCommand extends Command {
    readonly email: string;
    readonly name?: string;
    readonly password: string;
    readonly status: AdminStatus;

    constructor(props: CommandProps<CreateAdminCommand>) {
        super(props);
        this.email = props.email;
        this.name = props.name;
        this.password = props.password;
        this.status = props.status;
    }
}
