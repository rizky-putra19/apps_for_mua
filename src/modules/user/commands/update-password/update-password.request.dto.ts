import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MinLength } from "class-validator";

export class UpdatePasswordRequest {
    @ApiProperty({
        description: 'user password',
        required: true,
    })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Minimum 8 characters (no spaces), at least 1 letter and 1 number'
    })
    @IsNotEmpty()
    readonly password: string;
}
