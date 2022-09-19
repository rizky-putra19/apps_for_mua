import { Query } from "@src/libs/ddd/domain/base-classes/query-handler.base";

export class FindAdminQuery extends Query {
    readonly identifier: string;
    readonly findType: 'email' | 'id' | 'all';

    constructor(props: FindAdminQuery) {
        super();
        this.identifier = props.identifier;
        this.findType = props.findType;
    }
}
