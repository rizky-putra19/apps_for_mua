import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MaxLength, MinLength } from "class-validator";
import { UpdateAdmin } from '@src/interface-adapters/interfaces/user/update-user.interface';

export class UpdateAdminRequest implements UpdateAdmin {
    @ApiProperty({
        example: 'john@gmail.com',
        description: 'user email address',
        required: false,
    })
    @MaxLength(320)
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({
        description: 'user password',
        required: false,
    })
    @MinLength(3)
    @IsOptional()
    readonly password?: string;

    @ApiProperty({
        description: 'user name',
        required: false,
    })
    @IsOptional()
    readonly name?: string;
}
