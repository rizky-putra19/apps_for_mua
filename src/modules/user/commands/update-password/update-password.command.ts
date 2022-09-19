import { CommandProps, Command} from "@src/libs/ddd/domain/base-classes/command-base";

export class UpdatePasswordCommand extends Command {
    readonly userID: string;
    readonly password: string;

    constructor(props: CommandProps<UpdatePasswordCommand>) {
        super(props);
        this.userID = props.userID;
        this.password = props.password;
    }
}
