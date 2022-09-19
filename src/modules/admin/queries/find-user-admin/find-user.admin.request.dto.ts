import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FindAdminRequest {
    @IsOptional()
    readonly identifier: string;

    @IsNotEmpty()
    @Expose({ name: 'find_type' })
    readonly findType: 'email' | 'id' | 'all';
}
