import { Command, CommandProps } from "@src/libs/ddd/domain/base-classes/command-base";

export class  DeleteAdminCommand extends Command {
    readonly id?: string;

    constructor(props: CommandProps<DeleteAdminCommand>) {
        super(props);
        this.id = props.id;
    }
}
