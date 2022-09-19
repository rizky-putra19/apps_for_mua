import { 
    Command,
    CommandProps 
} from "@src/libs/ddd/domain/base-classes/command-base";

export class UpdateAdminCommand extends Command {
    readonly id?: string;
    readonly email?: string;
    readonly password?: string;
    readonly name?: string;

    constructor(props: CommandProps<UpdateAdminCommand>) {
        super(props);
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.name = props.name;
    }
}
