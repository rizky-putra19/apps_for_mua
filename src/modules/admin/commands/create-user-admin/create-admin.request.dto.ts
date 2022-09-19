import { ApiProperty } from "@nestjs/swagger";
import { CreateUser } from '@src/interface-adapters/interfaces/user/create-user.interface';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateAdminRequest implements CreateUser {
    @ApiProperty({
        example: 'joohn@gmail.com',
        description: 'User email address',
    })
    @MaxLength(320)
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'user password',
    })
    @MinLength(3)
    readonly password: string;

    @ApiProperty({
        description: 'user name',
        required: false,
    })
    readonly name?: string;
}
