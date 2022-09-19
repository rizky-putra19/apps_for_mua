import { Query } from "@src/libs/ddd/domain/base-classes/query-handler.base";

export class GetAdminQuery extends Query {
    readonly id?: string;

    constructor(props: GetAdminQuery) {
        super();
        this.id = props.id;
    }
}
