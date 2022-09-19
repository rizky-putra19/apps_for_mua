import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DeleteAdminRequest {
    @ApiProperty({
        example: '6ce70c5b-77c6-41c5-9606-71e35f4a2fdb',
        description: 'user id',
        required: true,
    })
    @IsNotEmpty()
    readonly id: string;
}
